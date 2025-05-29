import { DoctorPaginatedResponse } from "models/doctor";
import db from "../database/connection";
import { DoctorDTO } from "../dtos/doctor.dto";
import { MetaBuilder } from "../utils/MetaBuilder";

export class DoctorRepository {
  /**
   * Retorna uma lista paginada de médicos com filtros opcionais por especialidade e nome.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param specialty Lista de IDs de especialidades
   * @param name Nome parcial para busca
   */
  async getAllDoctors(
    page: number,
    size: number,
    specialty?: number[],
    name?: string
  ): Promise<DoctorPaginatedResponse> {
    const offset = (page - 1) * size;
    let queryDoctor = db('doctors');

    if (specialty && specialty.length > 0) {
      const specialtyIds = specialty.map(Number);

      const doctorIds = db('specialty_doctor')
        .whereIn('specialty_id', specialtyIds)
        .select('doctor_id');

      queryDoctor = queryDoctor.whereIn('id', doctorIds);
    }

    if (name) {
      queryDoctor = queryDoctor.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await queryDoctor.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const doctors = await queryDoctor.offset(offset).limit(size);

    const specialties = await db('doctor_specialties')
      .join('specialties', 'specialties.id', 'doctor_specialties.specialty_id')
      .whereIn('doctor_id', doctors.map(d => d.id))
      .select('doctor_specialties.doctor_id', 'doctor_specialties.specialty_id', 'specialties.name as specialty_name');

    return {
      doctors: doctors.map(doctor => ({
        ...doctor,
        specialties: specialties
          .filter(s => s.doctor_id === doctor.id)
          .map(s => s.specialty_id)
      })),
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca o primeiro médico com o CRM ou email informado.
   * @param crm CRM do médico
   * @param email Email do médico
   */
  async getFirstWhere(crm?: string, email?: string) {
    return db('doctors')
      .where('crm', crm)
      .orWhere('email', email)
      .first();
  }

  /**
   * Retorna um médico pelo seu ID, incluindo suas especialidades.
   * @param id ID do médico
   */
  async getDoctorById(id: string) {
    try {
      const doctor = await db('doctors').where('id', id).first();
      const specialties = await db('doctor_specialties')
        .join('specialties', 'specialties.id', 'doctor_specialties.specialty_id')
        .where('doctor_id', id)
        .select('doctor_specialties.doctor_id', 'doctor_specialties.specialty_id', 'specialties.name as specialty_name');

      return {
        ...doctor,
        specialties: specialties.map(s => s.specialty_id)
      };
    } catch (error) {
      console.error("Erro ao buscar médico:", error);
      return {
        message: "Erro ao buscar informações do médico",
        error: {
          errorType: error instanceof Error ? error.name : "Erro desconhecido",
          errorMessage: error instanceof Error ? error.message : String(error),
          errorLocation: "DoctorRepository.getDoctorById",
          doctorId: id
        }
      };
    }
  }

  /**
   * Cria um médico sem especialidades.
   * @param doctor Objeto com os dados do médico
   */
  async createDoctor(doctor: Omit<DoctorDTO, 'specialties'>) {
    return db('doctors').insert(doctor).returning('*');
  }

  /**
   * Cria um médico e relaciona suas especialidades em transação.
   * @param doctor DTO com dados do médico
   */
  async createDoctorWithSpecialties(doctor: DoctorDTO) {
    return db.transaction(async (trx) => {
      const [doctorResult] = await trx('doctors').insert({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone || '',
        email: doctor.email,
      }).returning('*');

      if (doctor.specialties.length > 0) {
        const specialtyRelations = doctor.specialties.map(specialtyId => ({
          doctor_id: doctorResult.id,
          specialty_id: specialtyId
        }));

        await trx('doctor_specialties').insert(specialtyRelations);
      }

      return {
        ...doctorResult,
        specialties: doctor.specialties
      };
    });
  }

  /**
   * Atualiza os dados de um médico sem alterar suas especialidades.
   * @param id ID do médico
   * @param doctor Objeto com os novos dados
   */
  async updateDoctor(id: string, doctor: Omit<DoctorDTO, 'specialties'>) {
    return db('doctors').where('id', id).update(doctor).returning('*');
  }

  /**
   * Atualiza parcialmente os dados e especialidades de um médico em transação.
   * @param id ID do médico
   * @param doctor DTO com os dados atualizados
   */
  async updateDoctorWithSpecialties(id: string, doctor: Partial<DoctorDTO>) {
    return db.transaction(async (trx) => {
      const doctorData = {
        ...(doctor.name && { name: doctor.name }),
        ...(doctor.crm && { crm: doctor.crm }),
        ...(doctor.phone && { phone: doctor.phone }),
        ...(doctor.email && { email: doctor.email }),
      };

      const [updatedDoctor] = await trx('doctors')
        .where('id', id)
        .update(doctorData)
        .returning('*');

      if (doctor.specialties !== undefined) {
        const currentSpecialties = await trx('doctor_specialties')
          .where('doctor_id', id)
          .select('specialty_id');

        const currentIds = currentSpecialties.map(s => s.specialty_id);
        const newIds = doctor.specialties;

        // Verifica se há diferença entre as especialidades atuais e as novas
        const toRemove = currentIds.filter(id => !newIds.includes(id));
        const toAdd = newIds.filter(id => !currentIds.includes(id));

        if (toRemove.length > 0) {
          await trx('doctor_specialties')
            .where('doctor_id', id)
            .whereIn('specialty_id', toRemove)
            .delete();
        }

        if (toAdd.length > 0) {
          const specialtyRelations = toAdd.map(specialtyId => ({
            doctor_id: id,
            specialty_id: specialtyId
          }));

          await trx('doctor_specialties').insert(specialtyRelations);
        }
      }

      // Busca as especialidades atualizadas
      const specialties = await trx('doctor_specialties')
        .join('specialties', 'specialties.id', 'doctor_specialties.specialty_id')
        .where('doctor_id', id)
        .select('specialty_id');

      return {
        ...updatedDoctor,
        specialties: specialties.map(s => s.specialty_id)
      };
    });
  }

  /**
   * Ativa ou desativa um médico.
   * @param id ID do médico
   * @param active Valor booleano para ativar ou desativar o médico
   */
  async updateDoctorActive(id: string, active: boolean) {
    return db('doctors').where('id', id).update({ active });
  }

  /**
   * Remove um médico do sistema.
   * @param id ID do médico
   */
  async deleteDoctor(id: string) {
    return db('doctors').where('id', id).delete();
  }
}

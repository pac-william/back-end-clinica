import { Doctor, DoctorPaginatedResponse } from 'models/doctor';
import db from '../../database/connection';
import { DoctorPort } from './doctorPort';
import { DoctorDTO } from '../../dtos/doctor.dto';

class DoctorService implements DoctorPort {
  async getAllDoctors(page: number = 1, limit: number = 10, specialty?: number, name?: string): Promise<DoctorPaginatedResponse> {
    
    const offset = (page - 1) * limit;

    let query = db('doctors')

    if (specialty) {
      query = query.whereRaw('LOWER(specialty.name) LIKE LOWER(?)', [`%${specialty}%`]);
    }

    if (name) {
      query = query.whereRaw('LOWER(doctors.name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await query.clone().count('doctors.id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const doctors = await query.offset(offset).limit(limit);

    console.log(doctors);

    return {
      doctors: doctors,
      meta: {
        total: total,
        page: page,
        limit: limit,
      }
    };
  }

  async getDoctorById(id: string) {
    const doctor = await db('doctors').where('id', id).first();
    if (!doctor) return null;

    const specialties = await db('doctor_specialties')
      .select('specialty.*')
      .join('specialty', 'doctor_specialties.specialty_id', 'specialty.id')
      .where('doctor_specialties.doctor_id', id);

    return {
      ...doctor,
      specialties
    };
  }

  async createDoctor(doctor: DoctorDTO): Promise<any> {
    const existing = await db('doctors')
      .where('crm', doctor.crm)
      .orWhere('email', doctor.email)
      .first();

    if (existing) {
      const errors: Record<string, string[]> = {};
      if (existing.crm === doctor.crm) errors.crm = ['CRM already registered'];
      if (existing.email === doctor.email) errors.email = ['Email already registered'];
      return {
        success: false,
        data: errors,
      };
    }

    // Verificar se todas as especialidades existem
    const existingSpecialties = await db('specialty')
      .whereIn('id', doctor.specialties)
      .select('id');

    if (existingSpecialties.length !== doctor.specialties.length) {
      return {
        success: false,
        data: {
          specialties: ['Uma ou mais especialidades não existem']
        }
      };
    }

    const trx = await db.transaction();

    try {
      const [doctorResult] = await trx('doctors').insert({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone,
        email: doctor.email,
      }).returning('*');

      // Inserir relacionamentos com especialidades
      await trx('doctor_specialties').insert(
        doctor.specialties.map(specialtyId => ({
          doctor_id: doctorResult.id,
          specialty_id: specialtyId
        }))
      );

      await trx.commit();

      return {
        success: true,
        data: {
          ...doctor,
          specialties: existingSpecialties
        }
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async updateDoctor(id: string, doctor: DoctorDTO) {
    const trx = await db.transaction();

    try {
      // Verificar se todas as especialidades existem
      const existingSpecialties = await trx('specialty')
        .whereIn('id', doctor.specialties)
        .select('id');

      if (existingSpecialties.length !== doctor.specialties.length) {
        await trx.rollback();
        return {
          success: false,
          data: {
            specialties: ['Uma ou mais especialidades não existem']
          }
        };
      }

      await trx('doctors').where('id', id).update({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone,
        email: doctor.email,
        updated_at: db.fn.now(),
      });

      // Atualizar especialidades
      await trx('doctor_specialties').where('doctor_id', id).delete();
      await trx('doctor_specialties').insert(
        doctor.specialties.map(specialtyId => ({
          doctor_id: id,
          specialty_id: specialtyId
        }))
      );

      await trx.commit();

      return await this.getDoctorById(id);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async deleteDoctor(id: string) {
    await db('doctors').where('id', id).delete();
  }
}

export default DoctorService;
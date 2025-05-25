import { DoctorPaginatedResponse } from 'models/doctor';
import db from '../database/connection';
import { DoctorDTO } from '../dtos/doctor.dto';
import { DoctorRepository } from '../repository/doctorRepository';
import { SpecialtyRepository } from '../repository/specialtyRepository';

const doctorRepository = new DoctorRepository();
const specialtyRepository = new SpecialtyRepository();

class DoctorService {
  async getAllDoctors(filters: { page: number; size: number; specialty?: number[]; name?: string }): Promise<DoctorPaginatedResponse> {
    const { page, size, specialty, name } = filters;
    const doctors = await doctorRepository.getAllDoctors(page, size, specialty, name);
    return doctors
  }

  async getDoctorById(id: string) {
    const doctor = await doctorRepository.getDoctorById(id);
    if (!doctor) return null;

    return doctor;
  }

  async createDoctor(doctor: DoctorDTO): Promise<any> {
    const existing = await doctorRepository.getFirstWhere(doctor.crm, doctor.email);

    if (existing) {
      const errors: Record<string, string[]> = {};
      if (existing.crm === doctor.crm) errors.crm = ['CRM already registered'];
      if (existing.email === doctor.email) errors.email = ['Email already registered'];
      return {
        success: false,
        data: errors,
      };
    }

    const existingSpecialties = await specialtyRepository.getSpecialtiesByIds(doctor.specialties)

    if (existingSpecialties.length !== doctor.specialties.length) {
      return {
        success: false,
        data: {
          specialties: ['Uma ou mais especialidades não existem']
        }
      };
    }

    try {
      // Inserir médico com array de IDs de especialidades
      const [doctorResult] = await db('doctors').insert({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone,
        email: doctor.email,
        specialties_ids: doctor.specialties // Salvar os IDs diretamente no campo array
      }).returning('*');

      return {
        success: true,
        data: {
          ...doctorResult,
          specialties: existingSpecialties
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDoctor(id: string, doctor: DoctorDTO) {
    try {
      // Verificar se todas as especialidades existem
      const existingSpecialties = await specialtyRepository.getSpecialtiesByIds(doctor.specialties);

      if (existingSpecialties.length !== doctor.specialties.length) {
        return {
          success: false,
          data: {
            specialties: ['Uma ou mais especialidades não existem']
          }
        };
      }

      const [updatedDoctor] = await db('doctors').where('id', id).update({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone,
        email: doctor.email,
        specialties_ids: doctor.specialties, // Atualiza os IDs de especialidades diretamente
        updated_at: db.fn.now(),
      }).returning('*');

      return {
        success: true,
        data: {
          ...updatedDoctor,
          specialties: existingSpecialties
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDoctor(id: string) {
    await db('doctors').where('id', id).delete();
  }
}

export default DoctorService;
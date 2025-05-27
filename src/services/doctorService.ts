import { DoctorDTO } from 'dtos/doctor.dto';
import { DoctorPaginatedResponse } from 'models/doctor';
import db from '../database/connection';
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

  async createDoctor(doctor: any): Promise<any> {
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

  async updateDoctor(id: string, doctor: DoctorDTO): Promise<{ success: boolean; doctor: DoctorDTO }> {
    try {
      const existingSpecialties = await specialtyRepository.getSpecialtiesByIds(doctor.specialties);

      if (existingSpecialties.length !== doctor.specialties.length) {
        throw new Error('Uma ou mais especialidades não existem');
      }

      const dataToUpdate = {
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone,
        email: doctor.email,
        specialties: existingSpecialties,
      }

      const [updatedDoctor] = await doctorRepository.updateDoctor(id, dataToUpdate);

      return {
        success: true,
        doctor: updatedDoctor,
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteDoctor(id: string) {
    await doctorRepository.deleteDoctor(id);
  }
}

export default DoctorService;
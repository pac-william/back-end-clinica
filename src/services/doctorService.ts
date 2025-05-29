import { DoctorDTO } from '../dtos/doctor.dto';
import { DoctorPaginatedResponse } from '../models/doctor';
import { DoctorRepository } from '../repository/doctorRepository';
import { SpecialtyRepository } from '../repository/specialtyRepository';
import { ErrorResponse } from '../utils/ErrorResponse';
import Utils from '../utils/utils';

const doctorRepository = new DoctorRepository();
const specialtyRepository = new SpecialtyRepository();

class DoctorService {
  async getAllDoctors(filters: { page: number; size: number; specialty?: number[]; name?: string }): Promise<DoctorPaginatedResponse | ErrorResponse> {
    try {
      const { page, size, specialty, name } = filters;
      const doctors = await doctorRepository.getAllDoctors(page, size, specialty, name);
      return doctors;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar médicos', 500).log(error as Error);
    }
  }

  async getDoctorById(id: string): Promise<DoctorDTO | ErrorResponse> {
    try {
      const doctor = await doctorRepository.getDoctorById(id);
      if (!doctor) {
        return new ErrorResponse('Médico não encontrado', 404);
      }
      return doctor;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar o médico', 500).log(error as Error);
    }
  }

  async createDoctor(doctor: DoctorDTO): Promise<DoctorDTO | ErrorResponse> {
    try {
      const existing = await doctorRepository.getFirstWhere(doctor.crm, doctor.email);

      if (existing) {
        if (existing.crm === doctor.crm) {
          return new ErrorResponse("Um médico com este CRM já existe", 400);
        }
        if (existing.email === doctor.email) {
          return new ErrorResponse("Um médico com este email já existe", 400);
        }
        return new ErrorResponse('Dados inválidos', 400);
      }

      doctor.phone = Utils.formatPhone(doctor.phone);

      const existingSpecialties = await specialtyRepository.getSpecialtiesByIds(doctor.specialties);

      if (existingSpecialties.length !== doctor.specialties.length) {
        return new ErrorResponse('Uma ou mais especialidades não existem', 400);
      }

      return await doctorRepository.createDoctorWithSpecialties(doctor);
    } catch (error) {
      return new ErrorResponse('Erro ao criar o médico', 500).log(error as Error);
    }
  }

  async updateDoctor(id: string, doctor: Partial<DoctorDTO>): Promise<DoctorDTO | ErrorResponse> {
    try {
      if (doctor.specialties) {
        const existingSpecialties = await specialtyRepository.getSpecialtiesByIds(doctor.specialties);
        if (existingSpecialties.length !== doctor.specialties.length) {
          return new ErrorResponse('Uma ou mais especialidades não existem', 400);
        }
      }

      if (doctor.phone) {
        doctor.phone = Utils.formatPhone(doctor.phone);
      }

      const updatedDoctor = await doctorRepository.updateDoctorWithSpecialties(id, doctor);
      return updatedDoctor;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar o médico', 500).log(error as Error);
    }
  }

  async activeDoctor(id: string, active: boolean): Promise<void | ErrorResponse> {
    try {
      await doctorRepository.updateDoctorActive(id, active);
    } catch (error) {
      return new ErrorResponse('Erro ao ativar/desativar o médico', 500).log(error as Error);
    }
  }

  async deleteDoctor(id: string): Promise<void | ErrorResponse> {
    try {
      await doctorRepository.deleteDoctor(id);
    } catch (error) {
      return new ErrorResponse('Erro ao deletar o médico', 500).log(error as Error);
    }
  }
}

export default DoctorService;
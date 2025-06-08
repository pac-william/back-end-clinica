import { MedicalRecordRepository } from '../repository/medicalRecordRepository';
import { ErrorResponse } from '../utils/ErrorResponse';
import DoctorService from './doctorService';
import PatientService from './patientService';

const medicalRecordRepository = new MedicalRecordRepository();
const doctorService = new DoctorService();
const patientService = new PatientService();

class MedicalRecordService {
  async newMedicalRecord(doctorId: string, patientId: string, description: string) {
    try {
      // Verificar se o médico existe
      const doctor = await doctorService.getDoctorById(doctorId);
      if (!doctor || doctor instanceof ErrorResponse) {
        return {
          success: false,
          message: 'Médico não encontrado'
        };
      }

      // Verificar se o paciente existe
      const patient = await patientService.getPatientById(patientId);
      if (!patient || patient instanceof ErrorResponse) {
        return {
          success: false,
          message: 'Paciente não encontrado'
        };
      }
      
      // Criar o registro médico
      const record = await medicalRecordRepository.createMedicalRecord(doctorId, patientId, description);
      
      return {
        success: true,
        data: record
      };
    } catch (error) {
      return new ErrorResponse('Erro ao criar registro médico', 500).log(error as Error);
    }
  }

  /**
   * Lista prontuários médicos de um médico com paginação.
   * @param doctorId Id do médico
   * @param page Número da página
   * @param size Tamanho da página
   * @returns Lista de prontuários e total
   */
  async getMedicalRecords(doctorId: string, page: number, size: number) {
    try {
      // Verificar se o médico existe
      const doctor = await doctorService.getDoctorById(doctorId);
      if (!doctor || doctor instanceof ErrorResponse) {
        return new ErrorResponse('Médico não encontrado', 404);
      }
      
      return await medicalRecordRepository.getMedicalRecords(doctorId, page, size);
    } catch (error) {
      return new ErrorResponse('Erro ao buscar registros médicos', 500).log(error as Error);
    }
  }

  /**
   * Busca um prontuário médico pelo id.
   * @param id Id do prontuário
   * @returns O prontuário encontrado ou erro
   */
  async getMedicalRecordById(id: string) {
    try {
      const record = await medicalRecordRepository.getMedicalRecordById(id);
      
      if (!record) {
        return new ErrorResponse('Registro médico não encontrado', 404);
      }
      
      return record;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar registro médico', 500).log(error as Error);
    }
  }

  async getPatientMedicalRecords(patientId: string, page: number, size: number) {
    try {
      // Verificar se o paciente existe
      const patient = await patientService.getPatientById(patientId);
      if (!patient || patient instanceof ErrorResponse) {
        return new ErrorResponse('Paciente não encontrado', 404);
      }
      
      return await medicalRecordRepository.getPatientMedicalRecords(patientId, page, size);
    } catch (error) {
      return new ErrorResponse('Erro ao buscar registros médicos do paciente', 500).log(error as Error);
    }
  }
}

export default MedicalRecordService;
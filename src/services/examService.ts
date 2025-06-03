import { ExamDTO } from '../dtos/exam.dto';
import { DoctorRepository } from '../repository/doctorRepository';
import { ExamRepository } from '../repository/examRepository';
import { PatientRepository } from '../repository/patientRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const examRepository = new ExamRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorRepository();

class ExamService {
  /**
   * Lista todos os exames com filtros opcionais.
   * @param filters Filtros de busca
   */
  async getAllExams(filters: {
    page: number;
    size: number;
    patientId?: number;
    doctorId?: number;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const { page, size, patientId, doctorId, status, type, startDate, endDate } = filters;
      
      // Converte datas se fornecidas
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;
      
      const exams = await examRepository.getAllExams(
        page,
        size,
        patientId,
        doctorId,
        status,
        type,
        parsedStartDate,
        parsedEndDate
      );
      
      return exams;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar exames', 500).log(error as Error);
    }
  }

  /**
   * Busca um exame específico pelo ID.
   * @param id ID do exame
   */
  async getExamById(id: string) {
    try {
      const exam = await examRepository.getExamById(id);
      
      if (!exam) {
        return new ErrorResponse('Exame não encontrado', 404);
      }
      
      return exam;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar exame', 500).log(error as Error);
    }
  }

  /**
   * Busca exames por paciente.
   * @param patientId ID do paciente
   */
  async getExamsByPatientId(patientId: number) {
    try {
      // Verificar se o paciente existe
      const patient = await patientRepository.getPatientById(patientId.toString());
      if (!patient) {
        return new ErrorResponse('Paciente não encontrado', 404);
      }
      
      const exams = await examRepository.getExamsByPatientId(patientId);
      return { exams };
    } catch (error) {
      return new ErrorResponse('Erro ao buscar exames do paciente', 500).log(error as Error);
    }
  }

  /**
   * Cria um novo exame.
   * @param examData Dados do exame
   */
  async createExam(examData: ExamDTO) {
    try {
      // Verificar se paciente existe
      const patient = await patientRepository.getPatientById(examData.patientId.toString());
      if (!patient) {
        return new ErrorResponse('Paciente não encontrado', 404);
      }

      // Verificar se médico existe
      const doctor = await doctorRepository.getDoctorById(examData.doctorId.toString());
      if (!doctor) {
        return new ErrorResponse('Médico não encontrado', 404);
      }

      const exam = await examRepository.createExam(examData);
      return exam;
    } catch (error) {
      return new ErrorResponse('Erro ao criar exame', 500).log(error as Error);
    }
  }

  /**
   * Atualiza um exame existente.
   * @param id ID do exame
   * @param examData Novos dados do exame
   */
  async updateExam(id: string, examData: Partial<ExamDTO>) {
    try {
      // Verificar se o exame existe
      const existingExam = await examRepository.getExamById(id);
      if (!existingExam) {
        return new ErrorResponse('Exame não encontrado', 404);
      }

      // Se estiver alterando o paciente, verificar se existe
      if (examData.patientId) {
        const patient = await patientRepository.getPatientById(examData.patientId.toString());
        if (!patient) {
          return new ErrorResponse('Paciente não encontrado', 404);
        }
      }

      // Se estiver alterando o médico, verificar se existe
      if (examData.doctorId) {
        const doctor = await doctorRepository.getDoctorById(examData.doctorId.toString());
        if (!doctor) {
          return new ErrorResponse('Médico não encontrado', 404);
        }
      }

      const updated = await examRepository.updateExam(id, examData);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar exame', 500).log(error as Error);
    }
  }

  /**
   * Atualiza o status de um exame.
   * @param id ID do exame
   * @param status Novo status
   */
  async updateExamStatus(id: string, status: string) {
    try {
      // Verificar se o exame existe
      const existingExam = await examRepository.getExamById(id);
      if (!existingExam) {
        return new ErrorResponse('Exame não encontrado', 404);
      }

      // Validar o status
      const validStatuses = ['SOLICITADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];
      if (!validStatuses.includes(status)) {
        return new ErrorResponse('Status inválido', 400);
      }

      const updated = await examRepository.updateExamStatus(id, status);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar status do exame', 500).log(error as Error);
    }
  }

  /**
   * Atualiza o resultado de um exame.
   * @param id ID do exame
   * @param result Resultado do exame
   */
  async updateExamResult(id: string, result: string) {
    try {
      // Verificar se o exame existe
      const existingExam = await examRepository.getExamById(id);
      if (!existingExam) {
        return new ErrorResponse('Exame não encontrado', 404);
      }

      if (!result || result.trim() === '') {
        return new ErrorResponse('Resultado do exame não pode ser vazio', 400);
      }

      const updated = await examRepository.updateExamResult(id, result);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar resultado do exame', 500).log(error as Error);
    }
  }

  /**
   * Remove um exame (soft delete).
   * @param id ID do exame
   */
  async deleteExam(id: string) {
    try {
      // Verificar se o exame existe
      const existingExam = await examRepository.getExamById(id);
      if (!existingExam) {
        return new ErrorResponse('Exame não encontrado', 404);
      }

      await examRepository.deleteExam(id);
      return { success: true };
    } catch (error) {
      return new ErrorResponse('Erro ao cancelar exame', 500).log(error as Error);
    }
  }
}

export default ExamService; 
import { AppointmentDTO } from '../dtos/appointment.dto';
import { AppointmentStatus } from '../enums/AppointmentStatus';
import { AppointmentRepository } from '../repository/appointmentRepository';
import { DoctorRepository } from '../repository/doctorRepository';
import { PatientRepository } from '../repository/patientRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const appointmentRepository = new AppointmentRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorRepository();

class AppointmentService {
  /**
   * Lista todas as consultas com filtros opcionais.
   * @param filters Filtros de busca
   */
  async getAllAppointments(filters: {
    page: number;
    size: number;
    patientId?: number;
    doctorId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const { page, size, patientId, doctorId, status, startDate, endDate } = filters;
      
      // Converte datas se fornecidas
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;
      
      const appointments = await appointmentRepository.getAllAppointments(
        page,
        size,
        patientId,
        doctorId,
        status,
        parsedStartDate,
        parsedEndDate
      );
      
      return appointments;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar consultas', 500).log(error as Error);
    }
  }

  /**
   * Busca uma consulta específica pelo ID.
   * @param id ID da consulta
   */
  async getAppointmentById(id: string) {
    try {
      const appointment = await appointmentRepository.getAppointmentById(id);
      
      if (!appointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }
      
      return appointment;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar consulta', 500).log(error as Error);
    }
  }

  /**
   * Cria uma nova consulta.
   * @param appointmentData Dados da consulta
   */
  async createAppointment(appointmentData: AppointmentDTO) {
    try {
      // Verificar se paciente existe
      const patient = await patientRepository.getPatientById(appointmentData.patientId.toString());
      if (!patient) {
        return new ErrorResponse('Paciente não encontrado', 404);
      }

      // Verificar se médico existe
      const doctor = await doctorRepository.getDoctorById(appointmentData.doctorId.toString());
      if (!doctor) {
        return new ErrorResponse('Médico não encontrado', 404);
      }

      // Verificar disponibilidade do médico
      const isAvailable = await appointmentRepository.checkDoctorAvailability(
        appointmentData.doctorId,
        appointmentData.date
      );

      if (!isAvailable) {
        return new ErrorResponse('Médico não disponível nesta data/horário', 400);
      }

      const appointment = await appointmentRepository.createAppointment(appointmentData);
      return appointment;
    } catch (error) {
      return new ErrorResponse('Erro ao criar consulta', 500).log(error as Error);
    }
  }

  /**
   * Atualiza uma consulta existente.
   * @param id ID da consulta
   * @param appointmentData Novos dados da consulta
   */
  async updateAppointment(id: string, appointmentData: Partial<AppointmentDTO>) {
    try {
      // Verificar se a consulta existe
      const existingAppointment = await appointmentRepository.getAppointmentById(id);
      if (!existingAppointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }

      // Se estiver alterando o médico ou a data, verificar disponibilidade
      if ((appointmentData.doctorId || appointmentData.date) && 
          (appointmentData.doctorId !== existingAppointment.doctor_id || 
           appointmentData.date && appointmentData.date.getTime() !== new Date(existingAppointment.date).getTime())) {
        
        const doctorId = appointmentData.doctorId || existingAppointment.doctor_id;
        const date = appointmentData.date || existingAppointment.date;

        const isAvailable = await appointmentRepository.checkDoctorAvailability(
          doctorId,
          date,
          id
        );

        if (!isAvailable) {
          return new ErrorResponse('Médico não disponível nesta data/horário', 400);
        }
      }

      const updated = await appointmentRepository.updateAppointment(id, appointmentData);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar consulta', 500).log(error as Error);
    }
  }

  /**
   * Atualiza o status de uma consulta.
   * @param id ID da consulta
   * @param status Novo status
   */
  async updateAppointmentStatus(id: string, status: string) {
    try {
      // Verificar se a consulta existe
      const existingAppointment = await appointmentRepository.getAppointmentById(id);
      if (!existingAppointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }

      // Validar o status
      const validStatuses = Object.values(AppointmentStatus);
      if (!validStatuses.includes(status as AppointmentStatus)) {
        return new ErrorResponse('Status inválido', 400);
      }

      const updated = await appointmentRepository.updateAppointmentStatus(id, status);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar status da consulta', 500).log(error as Error);
    }
  }

  /**
   * Remove uma consulta (soft delete).
   * @param id ID da consulta
   */
  async deleteAppointment(id: string) {
    try {
      // Verificar se a consulta existe
      const existingAppointment = await appointmentRepository.getAppointmentById(id);
      if (!existingAppointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }

      await appointmentRepository.deleteAppointment(id);
      return { success: true };
    } catch (error) {
      return new ErrorResponse('Erro ao cancelar consulta', 500).log(error as Error);
    }
  }
}

export default AppointmentService; 
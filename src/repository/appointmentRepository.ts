import db from "../database/connection";
import { AppointmentDTO } from "../dtos/appointment.dto";
import { AppointmentStatus } from "../enums/AppointmentStatus";
import { MetaBuilder } from "../utils/MetaBuilder";

export class AppointmentRepository {
  /**
   * Retorna uma lista paginada de consultas com filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param patientId Filtro por ID de paciente
   * @param doctorId Filtro por ID de médico
   * @param status Filtro por status
   * @param startDate Data inicial para filtro
   * @param endDate Data final para filtro
   */
  async getAllAppointments(
    page: number,
    size: number,
    patientId?: number,
    doctorId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const offset = (page - 1) * size;
    let query = db('appointments');

    if (patientId) {
      query = query.where('patient_id', patientId);
    }

    if (doctorId) {
      query = query.where('doctor_id', doctorId);
    }

    if (status) {
      query = query.where('status', status);
    }

    if (startDate && endDate) {
      query = query.whereBetween('date', [startDate, endDate]);
    } else if (startDate) {
      query = query.where('date', '>=', startDate);
    } else if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const appointments = await query.offset(offset).limit(size);

    return {
      appointments,
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca uma consulta pelo seu ID.
   * @param id ID da consulta
   */
  async getAppointmentById(id: string) {
    const appointment = await db('appointments').where('id', id).first();
    
    if (!appointment) {
      return null;
    }

    // Busca informações do paciente e médico relacionados
    const patient = await db('patients').where('id', appointment.patient_id).first();
    const doctor = await db('doctors').where('id', appointment.doctor_id).first();

    return {
      ...appointment,
      patient: patient ? { id: patient.id, name: patient.name } : null,
      doctor: doctor ? { id: doctor.id, name: doctor.name } : null
    };
  }

  /**
   * Verifica se um médico já tem consulta agendada na data/hora especificada.
   * @param doctorId ID do médico
   * @param date Data e hora da consulta
   * @param appointmentId ID da consulta atual (para exclusão na verificação)
   */
  async checkDoctorAvailability(doctorId: number, date: Date, appointmentId?: string) {
    const query = db('appointments')
      .where('doctor_id', doctorId)
      .where('date', date)
      .whereNot('status', AppointmentStatus.CANCELED);

    if (appointmentId) {
      query.whereNot('id', appointmentId);
    }

    const existing = await query.first();
    return !existing; // Retorna true se o médico estiver disponível
  }

  /**
   * Cria uma nova consulta.
   * @param appointment Dados da consulta
   */
  async createAppointment(appointment: AppointmentDTO) {
    const [result] = await db('appointments').insert({
      patient_id: appointment.patientId,
      doctor_id: appointment.doctorId,
      date: appointment.date,
      status: appointment.status
    }).returning('*');

    return result;
  }

  /**
   * Atualiza uma consulta existente.
   * @param id ID da consulta
   * @param appointment Dados atualizados
   */
  async updateAppointment(id: string, appointment: Partial<AppointmentDTO>) {
    const [result] = await db('appointments')
      .where('id', id)
      .update({
        ...(appointment.patientId && { patient_id: appointment.patientId }),
        ...(appointment.doctorId && { doctor_id: appointment.doctorId }),
        ...(appointment.date && { date: appointment.date }),
        ...(appointment.status && { status: appointment.status })
      })
      .returning('*');

    return result;
  }

  /**
   * Atualiza o status de uma consulta.
   * @param id ID da consulta
   * @param status Novo status
   */
  async updateAppointmentStatus(id: string, status: string) {
    const [result] = await db('appointments')
      .where('id', id)
      .update({ status })
      .returning('*');

    return result;
  }

  /**
   * Remove uma consulta (soft delete).
   * @param id ID da consulta
   */
  async deleteAppointment(id: string) {
    return db('appointments')
      .where('id', id)
      .update({ status: AppointmentStatus.CANCELED });
  }
} 
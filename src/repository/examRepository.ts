import db from "../database/connection";
import { ExamDTO } from "../dtos/exam.dto";
import { ExamStatus } from "../enums/ExamStatus";
import { MetaBuilder } from "../utils/MetaBuilder";

export class ExamRepository {
  /**
   * Retorna uma lista paginada de exames com filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param patientId Filtro por ID de paciente
   * @param doctorId Filtro por ID de médico
   * @param status Filtro por status
   * @param startDate Data inicial para filtro
   * @param endDate Data final para filtro
   */
  async getAllExams(
    page: number,
    size: number,
    patientId?: number,
    doctorId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const offset = (page - 1) * size;
    
    // Primeiro, obtemos os appointments relacionados aos filtros
    let appointmentQuery = db('appointments');
    
    if (patientId) {
      appointmentQuery = appointmentQuery.where('patient_id', patientId);
    }

    if (doctorId) {
      appointmentQuery = appointmentQuery.where('doctor_id', doctorId);
    }
    
    if (startDate && endDate) {
      appointmentQuery = appointmentQuery.whereBetween('date', [startDate, endDate]);
    } else if (startDate) {
      appointmentQuery = appointmentQuery.where('date', '>=', startDate);
    } else if (endDate) {
      appointmentQuery = appointmentQuery.where('date', '<=', endDate);
    }
    
    const appointmentIds = await appointmentQuery.pluck('id');
    
    // Agora consultamos os exames relacionados a esses appointments
    let query = db('appointment_exams')
      .whereIn('appointment_id', appointmentIds);
    
    if (status) {
      query = query.where('status', status);
    }
    
    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;
    
    const exams = await query
      .join('exams', 'appointment_exams.exam_id', 'exams.id')
      .join('appointments', 'appointment_exams.appointment_id', 'appointments.id')
      .join('patients', 'appointments.patient_id', 'patients.id')
      .join('doctors', 'appointments.doctor_id', 'doctors.id')
      .select(
        'appointment_exams.*',
        'exams.name as exam_name',
        'exams.description as exam_description',
        'exams.price as exam_price',
        'patients.id as patient_id',
        'patients.name as patient_name',
        'doctors.id as doctor_id',
        'doctors.name as doctor_name'
      )
      .offset(offset)
      .limit(size);
    
    return {
      exams: exams.map(exam => ({
        id: exam.id,
        appointmentId: exam.appointment_id,
        examId: exam.exam_id,
        examName: exam.exam_name,
        examDescription: exam.exam_description,
        examPrice: exam.exam_price,
        scheduledDate: exam.scheduled_date,
        resultDate: exam.result_date,
        status: exam.status,
        result: exam.result,
        notes: exam.notes,
        patient: { id: exam.patient_id, name: exam.patient_name },
        doctor: { id: exam.doctor_id, name: exam.doctor_name },
        createdAt: exam.created_at,
        updatedAt: exam.updated_at
      })),
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca um exame pelo seu ID.
   * @param id ID do exame (da tabela appointment_exams)
   */
  async getExamById(id: string) {
    const exam = await db('appointment_exams')
      .where('appointment_exams.id', id)
      .join('exams', 'appointment_exams.exam_id', 'exams.id')
      .join('appointments', 'appointment_exams.appointment_id', 'appointments.id')
      .join('patients', 'appointments.patient_id', 'patients.id')
      .join('doctors', 'appointments.doctor_id', 'doctors.id')
      .select(
        'appointment_exams.*',
        'exams.name as exam_name',
        'exams.description as exam_description',
        'exams.price as exam_price',
        'patients.id as patient_id',
        'patients.name as patient_name',
        'doctors.id as doctor_id',
        'doctors.name as doctor_name'
      )
      .first();
    
    if (!exam) {
      return null;
    }

    return {
      id: exam.id,
      appointmentId: exam.appointment_id,
      examId: exam.exam_id,
      examName: exam.exam_name,
      examDescription: exam.exam_description,
      examPrice: exam.exam_price,
      scheduledDate: exam.scheduled_date,
      resultDate: exam.result_date,
      status: exam.status,
      result: exam.result,
      notes: exam.notes,
      patient: { id: exam.patient_id, name: exam.patient_name },
      doctor: { id: exam.doctor_id, name: exam.doctor_name },
      createdAt: exam.created_at,
      updatedAt: exam.updated_at
    };
  }

  /**
   * Busca exames por ID de paciente.
   * @param patientId ID do paciente
   */
  async getExamsByPatientId(patientId: number) {
    const appointmentIds = await db('appointments')
      .where('patient_id', patientId)
      .pluck('id');
    
    return db('appointment_exams')
      .whereIn('appointment_id', appointmentIds)
      .join('exams', 'appointment_exams.exam_id', 'exams.id')
      .select('appointment_exams.*', 'exams.name as exam_name');
  }

  /**
   * Cria um novo exame para uma consulta.
   * @param exam Dados do exame
   */
  async createExam(exam: ExamDTO) {
    const [result] = await db('appointment_exams').insert({
      appointment_id: exam.appointmentId,
      exam_id: exam.examId,
      scheduled_date: exam.scheduledDate,
      result_date: exam.resultDate,
      status: exam.status,
      result: exam.result,
      notes: exam.notes
    }).returning('*');

    return result;
  }

  /**
   * Atualiza um exame existente.
   * @param id ID do exame
   * @param exam Dados atualizados
   */
  async updateExam(id: string, exam: Partial<ExamDTO>) {
    const [result] = await db('appointment_exams')
      .where('id', id)
      .update({
        ...(exam.appointmentId && { appointment_id: exam.appointmentId }),
        ...(exam.examId && { exam_id: exam.examId }),
        ...(exam.scheduledDate && { scheduled_date: exam.scheduledDate }),
        ...(exam.resultDate && { result_date: exam.resultDate }),
        ...(exam.status && { status: exam.status }),
        ...(exam.result !== undefined && { result: exam.result }),
        ...(exam.notes !== undefined && { notes: exam.notes })
      })
      .returning('*');

    return result;
  }

  /**
   * Atualiza o status de um exame.
   * @param id ID do exame
   * @param status Novo status
   */
  async updateExamStatus(id: string, status: string) {
    const [result] = await db('appointment_exams')
      .where('id', id)
      .update({ status })
      .returning('*');

    return result;
  }

  /**
   * Atualiza o resultado de um exame.
   * @param id ID do exame
   * @param result Resultado do exame
   */
  async updateExamResult(id: string, result: string) {
    const [updated] = await db('appointment_exams')
      .where('id', id)
      .update({ 
        result,
        status: ExamStatus.COMPLETED,
        result_date: new Date()
      })
      .returning('*');

    return updated;
  }

  /**
   * Remove um exame (soft delete marcando como CANCELED).
   * @param id ID do exame
   */
  async deleteExam(id: string) {
    return db('appointment_exams')
      .where('id', id)
      .update({ status: ExamStatus.CANCELED });
  }
} 
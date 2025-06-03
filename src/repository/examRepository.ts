import db from "../database/connection";
import { ExamDTO } from "../dtos/exam.dto";
import { MetaBuilder } from "../utils/MetaBuilder";

export class ExamRepository {
  /**
   * Retorna uma lista paginada de exames com filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param patientId Filtro por ID de paciente
   * @param doctorId Filtro por ID de médico
   * @param status Filtro por status
   * @param type Filtro por tipo de exame
   * @param startDate Data inicial para filtro
   * @param endDate Data final para filtro
   */
  async getAllExams(
    page: number,
    size: number,
    patientId?: number,
    doctorId?: number,
    status?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const offset = (page - 1) * size;
    let query = db('exams');

    if (patientId) {
      query = query.where('patient_id', patientId);
    }

    if (doctorId) {
      query = query.where('doctor_id', doctorId);
    }

    if (status) {
      query = query.where('status', status);
    }

    if (type) {
      query = query.whereRaw('LOWER(type) LIKE LOWER(?)', [`%${type}%`]);
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

    const exams = await query.offset(offset).limit(size);

    // Carrega informações adicionais
    const patientIds = [...new Set(exams.map(e => e.patient_id))];
    const doctorIds = [...new Set(exams.map(e => e.doctor_id))];

    const patients = await db('patients')
      .whereIn('id', patientIds)
      .select('id', 'name');

    const doctors = await db('doctors')
      .whereIn('id', doctorIds)
      .select('id', 'name');

    return {
      exams: exams.map(exam => ({
        ...exam,
        patient: patients.find(p => p.id === exam.patient_id) || null,
        doctor: doctors.find(d => d.id === exam.doctor_id) || null
      })),
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca um exame pelo seu ID.
   * @param id ID do exame
   */
  async getExamById(id: string) {
    const exam = await db('exams').where('id', id).first();
    
    if (!exam) {
      return null;
    }

    // Busca informações do paciente e médico relacionados
    const patient = await db('patients').where('id', exam.patient_id).first();
    const doctor = await db('doctors').where('id', exam.doctor_id).first();

    return {
      ...exam,
      patient: patient ? { id: patient.id, name: patient.name } : null,
      doctor: doctor ? { id: doctor.id, name: doctor.name } : null
    };
  }

  /**
   * Busca exames por ID de paciente.
   * @param patientId ID do paciente
   */
  async getExamsByPatientId(patientId: number) {
    return db('exams').where('patient_id', patientId);
  }

  /**
   * Cria um novo exame.
   * @param exam Dados do exame
   */
  async createExam(exam: ExamDTO) {
    const [result] = await db('exams').insert({
      patient_id: exam.patientId,
      doctor_id: exam.doctorId,
      type: exam.type,
      date: exam.date,
      result: exam.result || '',
      status: exam.status
    }).returning('*');

    return result;
  }

  /**
   * Atualiza um exame existente.
   * @param id ID do exame
   * @param exam Dados atualizados
   */
  async updateExam(id: string, exam: Partial<ExamDTO>) {
    const [result] = await db('exams')
      .where('id', id)
      .update({
        ...(exam.patientId && { patient_id: exam.patientId }),
        ...(exam.doctorId && { doctor_id: exam.doctorId }),
        ...(exam.type && { type: exam.type }),
        ...(exam.date && { date: exam.date }),
        ...(exam.result !== undefined && { result: exam.result }),
        ...(exam.status && { status: exam.status })
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
    const [result] = await db('exams')
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
    const [updated] = await db('exams')
      .where('id', id)
      .update({ 
        result,
        status: 'CONCLUIDO'
      })
      .returning('*');

    return updated;
  }

  /**
   * Remove um exame (soft delete marcando como CANCELADO).
   * @param id ID do exame
   */
  async deleteExam(id: string) {
    return db('exams')
      .where('id', id)
      .update({ status: 'CANCELADO' });
  }
} 
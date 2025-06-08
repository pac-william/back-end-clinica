import db from '../database/connection';
import { Doctor } from '../models/doctor';
import DoctorService from './doctorService';
import PatientService from './patientService';

// Service responsável pelas operações de negócio relacionadas aos prontuários médicos
class MedicalRecordService {
  /**
   * Cria um novo prontuário médico.
   * @param id Id do médico
   * @param patientId Id do paciente
   * @param description Descrição do prontuário
   * @returns O prontuário criado ou erro
   */
  async newMedicalRecord(id: string, patientId: string, description: string) {
    const trx = await db.transaction();

    const doctorService = new DoctorService();
    const doctor: Doctor = await doctorService.getDoctorById(id);
    if (!doctor) {
        return {
          success: false,
          message: 'Doctor not found'
        };
    }

    const patientService = new PatientService();
    const patient = await patientService.getPatientById(patientId);

    if (!patient) {
      return {
        success: false,
        message: 'Patient not found'
      };
    }
    
    try {
      const [record] = await trx('medical_record')
        .insert({
          doctor_id: id,
          patient_id: patientId,
          description: description
        })
        .returning('*');

      await trx.commit();
      return {
        success: true,
        data: record
      };
    } catch (error) {
      await trx.rollback();
      throw error;
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
    const trx = await db.transaction();

    try {
      const [totalResult] = await trx('medical_record')
        .where('doctor_id', doctorId)
        .count({ count: '*' });

      const total = Number(totalResult.count);

      const records = await trx('medical_record')
        .where('doctor_id', doctorId)
        .limit(size)
        .select('*');

      await trx.commit();

      return {
        data: records,
        total,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Busca um prontuário médico pelo id.
   * @param id Id do prontuário
   * @returns O prontuário encontrado ou erro
   */
  async getMedicalRecordById(id: string) {
    const trx = await db.transaction();

    try {
      const record = await trx('medical_record')
        .where('id', id)
        .first();

      await trx.commit();
      return record;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

}

export default MedicalRecordService;
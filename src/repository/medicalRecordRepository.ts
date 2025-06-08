import db from "../database/connection";
import { MetaBuilder } from "../utils/MetaBuilder";

export class MedicalRecordRepository {
  /**
   * Cria um novo registro médico.
   * @param doctorId ID do médico
   * @param patientId ID do paciente
   * @param description Descrição do registro médico
   */
  async createMedicalRecord(doctorId: string, patientId: string, description: string) {
    const trx = await db.transaction();
    
    try {
      const [record] = await trx('medical_record')
        .insert({
          doctor_id: doctorId,
          patient_id: patientId,
          description: description
        })
        .returning('*');

      await trx.commit();
      return record;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Retorna todos os registros médicos de um médico específico.
   * @param doctorId ID do médico
   * @param page Página atual
   * @param size Quantidade de itens por página
   */
  async getMedicalRecords(doctorId: string, page: number, size: number) {
    const offset = (page - 1) * size;
    const trx = await db.transaction();

    try {
      const [totalResult] = await trx('medical_record')
        .where('doctor_id', doctorId)
        .count({ count: '*' });

      const total = Number(totalResult.count);

      const records = await trx('medical_record')
        .where('doctor_id', doctorId)
        .offset(offset)
        .limit(size)
        .select('*');

      await trx.commit();

      return {
        data: records,
        meta: new MetaBuilder(total, page, size).build()
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Busca um registro médico pelo seu ID.
   * @param id ID do registro médico
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

  /**
   * Busca todos os registros médicos de um paciente específico.
   * @param patientId ID do paciente
   * @param page Página atual
   * @param size Quantidade de itens por página
   */
  async getPatientMedicalRecords(patientId: string, page: number, size: number) {
    const offset = (page - 1) * size;
    const trx = await db.transaction();

    try {
      const [totalResult] = await trx('medical_record')
        .where('patient_id', patientId)
        .count({ count: '*' });

      const total = Number(totalResult.count);

      const records = await trx('medical_record')
        .where('patient_id', patientId)
        .offset(offset)
        .limit(size)
        .select('*');

      await trx.commit();

      return {
        data: records,
        meta: new MetaBuilder(total, page, size).build()
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
} 
import { MedicalRecord } from 'models/medicalRecord';
import db from '../database/connection';

class MedicalRecordService {
  async newMedicalRecord(id: string, patientId: string, description: string) {
    const trx = await db.transaction();


    try {
      const [record] = await trx('medical_record')
        .insert({
          doctor_id: id,
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

  async getMedicalRecords(doctorId: string, limit: number, offset: number) {
    const trx = await db.transaction();

    try {
      const [totalResult] = await trx('medical_record')
        .where('doctor_id', doctorId)
        .count({ count: '*' });

      const total = Number(totalResult.count);

      const records = await trx('medical_record')
        .where('doctor_id', doctorId)
        .limit(limit)
        .offset(offset)
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
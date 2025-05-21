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

  async getMedicalRecords(id: string) {
    const trx = await db.transaction();

    try {
      const records = await trx('medical_record')
        .where('doctor_id', id)
        .select('*');

      await trx.commit();
      return records;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

export default MedicalRecordService;
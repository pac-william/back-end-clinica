import { Request, RequestHandler, Response } from 'express';
import MedicalRecordService from '../services/medicalRecordService';
import { log } from 'console';

const medicalRecordService = new MedicalRecordService();

class MedicalController {
  newMedicalRecord: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { patientId, description } = req.body;

    if (!id || !patientId || !description) {
      res.status(400).json({ error: 'Doctor ID, patient ID, and description are required' });
      return;
    }

    try {
      const medicalRecord = await medicalRecordService.newMedicalRecord(id, patientId, description);

      res.status(201).json(medicalRecord);
    } catch (error: any) {
        log(error);
      console.error("Erro ao criar prontuário:", error);
      res.status(500).json({ error: 'Erro interno ao criar prontuário médico' });
    }
  };
}

export default MedicalController;
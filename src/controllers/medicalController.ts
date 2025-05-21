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

  getMedicalRecords: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Doctor ID is required' });
      return;
    }

    try {
      const medicalRecords = await medicalRecordService.getMedicalRecords(id);

      res.status(200).json(medicalRecords);
    } catch (error: any) {
        log(error);
      console.error("Erro ao obter prontuários:", error);
      res.status(500).json({ error: 'Erro interno ao obter prontuários médicos' });
    }
  };
}

export default MedicalController;
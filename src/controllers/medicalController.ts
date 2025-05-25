import { log } from 'console';
import { Request, RequestHandler, Response } from 'express';
import MedicalRecordService from '../services/medicalRecordService';
import { QueryBuilder } from '../utils/QueryBuilder';

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
    const { page, size } = QueryBuilder.from(req.query)
      .withNumber('page', 1)
      .withNumber('size', 10)
      .build();
    const offset = (page - 1) * size;

    if (!id) {
      res.status(400).json({ error: 'Doctor ID is required' });
      return;
    }


    try {
      const { data, total } = await medicalRecordService.getMedicalRecords(id, size, offset);

      const totalPages = Math.ceil(total / size);

      res.status(200).json({
        data,
        meta: {
          total,
          page,
          size,
          totalPages,
        },
      });
    } catch (error: any) {
      log(error);
      console.error("Erro ao obter prontuários:", error);
      res.status(500).json({ error: 'Erro interno ao obter prontuários médicos' });
    }
  };

  getMedicalRecordById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Medical record ID is required' });
      return;
    }

    try {
      const medicalRecord = await medicalRecordService.getMedicalRecordById(id);
      if (!medicalRecord) {
        res.status(404).json({ error: 'Medical record not found' });
        return;
      }
      res.status(200).json(medicalRecord);
    } catch (error: any) {
      log(error);
      console.error("Erro ao obter prontuário:", error);
      res.status(500).json({ error: 'Erro interno ao obter prontuário médico' });
    }
  }

}

export default MedicalController;
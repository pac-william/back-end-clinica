import { log } from 'console';
import { Request, RequestHandler, Response } from 'express';
import MedicalRecordService from '../services/medicalRecordService';
import { QueryParamsBuilder } from '../utils/QueryParamsBuilder';

const medicalRecordService = new MedicalRecordService();

class MedicalController {
  /**
   * Cria um novo prontuário médico para um paciente.
   * @param req Requisição HTTP contendo id do médico, id do paciente e descrição do prontuário.
   * @param res Resposta HTTP.
   * @returns Retorna o prontuário criado ou um erro caso falhe.
   */
  newMedicalRecord: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { patientId, description } = req.body;

    if (!id || !patientId || !description) {
      res.status(400).json({ error: 'Doctor ID, patient ID, and description are required' });
      return;
    }

    try {
      const medicalRecord = await medicalRecordService.newMedicalRecord(id, patientId, description);

      if (!medicalRecord.success) {
        res.status(401).json(medicalRecord);
        return;
      }

      res.status(201).json(medicalRecord);
    } catch (error: any) {
      log(error);
      console.error("Erro ao criar prontuário:", error);
      res.status(500).json({ error: 'Erro interno ao criar prontuário médico' });
    }
  };

  /**
   * Lista os prontuários médicos de um médico com paginação.
   * @param req Requisição HTTP contendo id do médico e parâmetros de paginação (page, size).
   * @param res Resposta HTTP.
   * @returns Retorna a lista de prontuários e metadados de paginação.
   */
  getMedicalRecords: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page, size } = QueryParamsBuilder.from(req.query)
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

  /**
   * Busca um prontuário médico específico pelo seu id.
   * @param req Requisição HTTP contendo o id do prontuário.
   * @param res Resposta HTTP.
   * @returns Retorna o prontuário encontrado ou erro caso não exista.
   */
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
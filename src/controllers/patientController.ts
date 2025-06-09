import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { patientDTO } from '../dtos/patient.dto';
import PatientService from '../services/patientService';
import { QueryParamsBuilder } from '../utils/QueryParamsBuilder';

const patientService = new PatientService();

class PatientController {
  /**
   * Lista pacientes com filtros e paginação.
   * @param req Requisição HTTP
   * @param res Resposta HTTP
   * @returns Lista de pacientes
   */
  getAllPatients: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { page, size, name, email, phone } = QueryParamsBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withString('name')
        .withString('email')
        .withString('phone')
        .build();
      const patients = await patientService.getAllPatients(page, size, name, email, phone);
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  };

  /**
   * Busca um paciente pelo id.
   * @param req Requisição HTTP (deve conter o id nos parâmetros)
   * @param res Resposta HTTP
   * @returns O paciente encontrado ou 404 se não existir
   */
  getPatientById: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve patient' });
    }
  };

  /**
   * Cria um novo paciente.
   * @param req Requisição HTTP (deve conter os dados do paciente no body)
   * @param res Resposta HTTP
   * @returns O paciente criado ou erro de validação
   */
  createPatient: RequestHandler = async (req: Request, res: Response) => {
    try {
      const body = patientDTO.parse(req.body);
      const response = await patientService.createPatient(body);
      if(!response.success) {
        res.status(400).json({
          message: response.message
        });
        return;
      }

      res.status(201).json(response.data);
    }
    catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "invalid-request",
          errors: err.issues
        });
      } else {
        res.status(500).json({
          errors: err
        });
      }
    }
  };

  /**
   * Atualiza os dados de um paciente existente.
   * @param req Requisição HTTP (deve conter o id nos parâmetros e os dados no body)
   * @param res Resposta HTTP
   * @returns O paciente atualizado ou 404 se não existir
   */
  updatePatient: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, address, phone, cpf, birth_date } = req.body;
      const patient = await patientService.updatePatient(id, { name, address, phone, cpf, birth_date });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update patient' });
    }
  };

  /**
   * Remove um paciente pelo id.
   * @param req Requisição HTTP (deve conter o id nos parâmetros)
   * @param res Resposta HTTP
   * @returns Mensagem de sucesso ou erro
   */
  deletePatient: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const patient = await patientService.deletePatient(id);
      res.json({ message: 'Patient deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  };
}

export default PatientController;

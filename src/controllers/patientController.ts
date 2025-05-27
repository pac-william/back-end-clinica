import { Request, RequestHandler, Response } from 'express';
import PatientService from '../services/patientService';
import { QueryBuilder } from '../utils/QueryBuilder';
import { patientDTO } from '../dtos/patient.dto';
import { ZodError } from 'zod';

const patientService = new PatientService();

class PatientController {
  getAllPatients: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { page, size, name, email, phone } = QueryBuilder.from(req.query)
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

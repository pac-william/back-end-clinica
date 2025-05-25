import { Request, RequestHandler, Response } from 'express';
import PatientService from '../services/patientService';
import { QueryBuilder } from '../utils/QueryBuilder';

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
      const { name, address, phone, cpf } = req.body;

      const patient = await patientService.createPatient({ name, address, phone, cpf });

      res.status(201).json({
        patient: patient
      });

    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  };

  updatePatient: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, address, phone, cpf } = req.body;
      const patient = await patientService.updatePatient(id, { name, address, phone, cpf });
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

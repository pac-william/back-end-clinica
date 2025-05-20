import { Request, RequestHandler, Response } from 'express';
import PatientService from '../services/patient/PatientService';

const patientService = new PatientService();

class PatientController {
  getAllPatients: RequestHandler = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const name = req.query.name as string | undefined;
      const email = req.query.email as string | undefined;
      const phone = req.query.phone as string | undefined;
      
      const patients = await patientService.getAllPatients(page, limit, name, email, phone);
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

      const patient = await patientService.createPatient({name, address, phone, cpf});

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
      const patient = await patientService.updatePatient(id, {name, address, phone, cpf});
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

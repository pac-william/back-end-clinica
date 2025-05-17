import { Request, RequestHandler, Response } from 'express';
import PatientService from '../services/patientService';

const patientService = new PatientService();

class PatientController {
  getAllPatients: RequestHandler = async (req: Request, res: Response) => {
    try {
      const patients = await patientService.getAllPatients();
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
      const { name, email, phone } = req.body;

      const patient = await patientService.createPatient(name, email, phone);

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
      const { name, email, phone } = req.body;
      const patient = await patientService.updatePatient(id, name, email, phone);
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
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  };
}

export default PatientController;

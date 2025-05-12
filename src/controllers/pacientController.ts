import { Request, Response, RequestHandler } from 'express';
import PatientService from '../services/PatientService';

class PatientController {
  private patientService: PatientService;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  getAllPatients: RequestHandler = async (req: Request, res: Response) => {
    try {
      const patients = await this.patientService.getAllPatients();
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  };

  getPatientById: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const patient = await this.patientService.getPatientById(id);
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
      const patient = await this.patientService.createPatient(name, email, phone);
      res.status(201).json(patient);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  };

  updatePatient: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const patient = await this.patientService.updatePatient(id, name, email, phone);
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
      const patient = await this.patientService.deletePatient(id);
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

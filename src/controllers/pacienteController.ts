import { Request, Response } from 'express';
import PatientService from '../services/PatientService';

const patientService = new PatientService();

class PatientController {
  async getAllPatients(req: Request, res: Response) {
    const patients = await patientService.getAllPatients();
    res.json(patients);
  }
}

export default PatientController;

import { Request, Response } from 'express';
import PatientService from '../services/PatientService';

const patientService = new PatientService();

class PatientController {
  async getAllPatients(req: Request, res: Response) {
    const patients = await patientService.getAllPatients();
    res.json(patients);
  }

  async getPatientById(req: Request, res: Response) {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);
    res.json(patient);
  }

  async createPatient(req: Request, res: Response) {
    const { name, email, phone } = req.body;
    const patient = await patientService.createPatient(name, email, phone);
    res.json(patient);
  }

  async updatePatient(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const patient = await patientService.updatePatient(id, name, email, phone);
    res.json(patient);
  }

  async deletePatient(req: Request, res: Response) {
    const { id } = req.params;
    const patient = await patientService.deletePatient(id);
    res.json(patient);
  }

}

export default PatientController;

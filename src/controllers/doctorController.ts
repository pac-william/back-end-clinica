import { Request, RequestHandler, Response } from 'express';
import DoctorService from '../services/doctorService';

class DoctorController {
  private doctorService: DoctorService;

  constructor(doctorService: DoctorService) {
    this.doctorService = doctorService;
  }

  getAllDoctors: RequestHandler =  async (req: Request, res: Response) => {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  };

  getDoctorById: RequestHandler = async (req:Request, res: Response) => {
    const { id } = req.params;
    const doctor = await this.doctorService.getDoctorById(id);
    if (!doctor) {
      res.status(404).json({ error: 'Médico não encontrado' });
      return;
    }
    res.json(doctor);
  };

  createDoctor: RequestHandler = async (req: Request, res: Response) => {
    const { name, crm, specialty, phone, email } = req.body;
    const doctor = await this.doctorService.createDoctor(name, crm, specialty, phone, email);
    res.status(201).json(doctor);
  };

  updateDoctor: RequestHandler = async (req:Request, res: Response) => {
    const { id } = req.params;
    const { name, crm, specialty, phone, email } = req.body;
    const doctor = await this.doctorService.updateDoctor(id, name, crm, specialty, phone, email);
    if (!doctor) {
      res.status(404).json({ error: 'Médico não encontrado' });
      return;
    }
    res.json(doctor);
  };

  deleteDoctor: RequestHandler = async (req:Request, res: Response) => {
    const { id } = req.params;
    const result = await this.doctorService.deleteDoctor(id);
    if (!result.id) {
      res.status(404).json({ error: 'Médico não encontrado' });
      return;
    }
    res.json({ message: 'Médico removido' });
  };
}

export default DoctorController;

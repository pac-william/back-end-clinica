import { Request, Response } from 'express';
import DoctorService from '../services/doctorService';

class DoctorController {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  async getAllDoctors(req: Request, res: Response) {
    const doctors = await this.doctorService.getAllDoctors();
    res.json(doctors);
  }

  async getDoctorById(req: Request, res: Response) {
    const { id } = req.params;
    const doctor = await this.doctorService.getDoctorById(id);
    if (!doctor) return res.status(404).json({ error: 'Médico não encontrado' });
    res.json(doctor);
  }

  async createDoctor(req: Request, res: Response) {
    const { name, crm, specialty, phone, email } = req.body;
    const doctor = await this.doctorService.createDoctor(name, crm, specialty, phone, email);
    res.status(201).json(doctor);
  }

  async updateDoctor(req: Request, res: Response) {
    const { id } = req.params;
    const { name, crm, specialty, phone, email } = req.body;
    const doctor = await this.doctorService.updateDoctor(id, name, crm, specialty, phone, email);
    if (!doctor) return res.status(404).json({ error: 'Médico não encontrado' });
    res.json(doctor);
  }

  async deleteDoctor(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.doctorService.deleteDoctor(id);
    if (!result.id) return res.status(404).json({ error: 'Médico não encontrado' });
    res.json({ message: 'Médico removido' });
  }
}

export default DoctorController;
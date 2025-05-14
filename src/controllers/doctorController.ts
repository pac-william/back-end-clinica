import { Request, RequestHandler, Response } from 'express';
import DoctorService from '../services/doctorService';
import { doctorSchema } from '../schemas/doctor.schema';
import { ZodError } from 'zod';

class DoctorController {
  private doctorService: DoctorService;

  constructor(doctorService: DoctorService) {
    this.doctorService = doctorService;
  }

  getAllDoctors: RequestHandler = async (req: Request, res: Response) => {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  };

  getDoctorById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctor = await this.doctorService.getDoctorById(id);
    if (!doctor) {
      res.status(404).json({ error: 'Médico não encontrado' });
      return;
    }
    res.json(doctor);
  };

  createDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      doctorSchema.parse(req.body);
      const { name, crm, specialty, phone, email} = req.body;
      const doctor = await this.doctorService.createDoctor(name, crm, specialty, phone, email);
      if(!doctor?.success) {
          res.status(400).json(doctor);
          return;
      }

      res.status(201).json(doctor);
      return;
    } catch (err) {
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

  updateDoctor: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, crm, specialty, phone, email } = req.body;
    const doctor = await this.doctorService.updateDoctor(id, name, crm, specialty, phone, email);
    if (!doctor) {
      res.status(404).json({ error: 'Médico não encontrado' });
      return;
    }
    res.json(doctor);
  };

  deleteDoctor: RequestHandler = async (req: Request, res: Response) => {
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

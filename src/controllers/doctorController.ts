import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { doctorDTO } from '../dtos/doctor.dto';
import DoctorService from '../services/doctor/doctorService';

const doctorService = new DoctorService();

class DoctorController {
  getAllDoctors: RequestHandler = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const specialty = req.query.specialty as number | undefined;
      const name = req.query.name as string | undefined;

      const doctors = await doctorService.getAllDoctors(page, limit, specialty, name);
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  };

  getDoctorById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  };

  createDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      doctorDTO.parse(req.body);
      const { name, crm, specialties, phone, email } = req.body;

      const doctor = await doctorService.createDoctor({name, crm, specialties, phone, email});

      if (!doctor?.success) {
        res.status(400).json(doctor);
        return;
      }

      res.status(201).json({
        doctor: doctor.data
      });

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
    try {
      doctorDTO.parse(req.body);
      const { id } = req.params;
      const { name, crm, specialties, phone, email } = req.body;
      
      const doctor = await doctorService.updateDoctor(id, {name, crm, specialties, phone, email});
      
      if (!doctor?.success) {
        res.status(400).json(doctor);
        return;
      }

      res.json(doctor);
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

  deleteDoctor: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    await doctorService.deleteDoctor(id);
    res.json({ message: 'Doctor deleted successfully' });
  };

  
}

export default DoctorController;

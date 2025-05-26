import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import DoctorService from '../services/doctorService';
import { QueryBuilder } from '../utils/QueryBuilder';
import {DoctorDTO} from '../dtos/doctor.dto';

const doctorService = new DoctorService();

class DoctorController {
  getAllDoctors: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withArray('specialty')
        .withString('name')
        .build();

      const doctors = await doctorService.getAllDoctors(filters);

      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  };

  getDoctorById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctor = await doctorService.getDoctorById(id);
      if (!doctor) {
        res.status(404).json({ error: 'Doctor not found' });
        return;
      }
      res.json(doctor);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  };

  createDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      DoctorDTO.parse(req.body);
      const { name, crm, specialties, phone, email } = req.body;

      const doctor = await doctorService.createDoctor({ name, crm, specialties, phone, email });

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
      DoctorDTO.parse(req.body);
      const { id } = req.params;
      const { name, crm, specialties, phone, email } = req.body;

      const doctor = await doctorService.updateDoctor(id, { name, crm, specialties, phone, email });

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

import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { doctorDTO } from '../dtos/doctor.dto';
import MedicalRecordService from '../services/medicalRecordService';


const medicalRecordService = new MedicalRecordService();

class medicalController {

    newMedicalRecord: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { patientId, description } = req.body;


        if (!patientId || !description) {
            res.status(400).json({ error: 'Patient ID and description are required' });
            return;
        }

        const medicalRecord = await medicalRecordService.newMedicalRecord(id, patientId, description);
        if (!medicalRecord) {
            res.status(404).json({ error: 'Doctor not found' });
            return;
        }
        res.json(medicalRecord);
    }
}

export default medicalController;
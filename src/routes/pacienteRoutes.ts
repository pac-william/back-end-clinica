import express from 'express';
import PatientController from '../controllers/pacienteController';

const router = express.Router();
const patientController = new PatientController();

router.get('/patients', patientController.getAllPatients);

export default router;
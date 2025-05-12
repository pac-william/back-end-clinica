import express from 'express';
import NursesService from '../services/nurser.service';
import NursesController from '../controllers/nurser.controller';
const router = express.Router();
const doctorService = new NursesService();
const doctorController = new NursesController(doctorService);

router.get('/', doctorController.getAll);
/* router.post('/', doctorController.createDoctor);
router.put('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor); */

export default router;
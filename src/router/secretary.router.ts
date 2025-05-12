import express from 'express';
import NursesService from '../services/secretarys.service';
import NursesController from '../controllers/secretary.controller';
const router = express.Router();
const secretaryService = new NursesService();
const secretaryController = new NursesController(secretaryService);

router.get('/', secretaryController.getAll);
router.post('/', secretaryController.create);
/* 
router.put('/:id', secretaryController.updatesecretary);
router.delete('/:id', secretaryController.deletesecretary); */

export default router;
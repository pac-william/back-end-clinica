import express from 'express';
import NursesController from '../controllers/secretaryController';

const router = express.Router();
const secretaryController = new NursesController();

router.get('/', secretaryController.getAll);
router.post('/', secretaryController.create);
/* 
router.put('/:id', secretaryController.updatesecretary);
router.delete('/:id', secretaryController.deletesecretary); */

export default router;
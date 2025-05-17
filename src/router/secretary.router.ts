import express from 'express';
import NursesService from '../services/secretarys.service';
import NursesController from '../controllers/secretary.controller';
import UserService from '../services/userService';

const router = express.Router();
const secretaryService = new NursesService();
const userService = new UserService();
const secretaryController = new NursesController(secretaryService,userService);

router.get('/', secretaryController.getAll);
router.post('/', secretaryController.create);
/* 
router.put('/:id', secretaryController.updatesecretary);
router.delete('/:id', secretaryController.deletesecretary); */

export default router;
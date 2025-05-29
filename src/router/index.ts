import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import doctorRoutes from './doctorRoutes';
import medical from './medicalRecordRoute';
import patientRoutes from './patientRoutes';
import secretaryRoutes from './secretaryRouter';
import specialtyRoutes from './specialtyRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api/v1/swagger-ui');
});

// Rotas autenticadas
router.use('/api/v1/patients', authMiddleware, patientRoutes);
router.use('/api/v1/secretary', authMiddleware, secretaryRoutes);
router.use('/api/v1/doctors', authMiddleware, doctorRoutes);
router.use('/api/v1/specialties', authMiddleware, specialtyRoutes);
router.use('/api/v1/medical-records', authMiddleware, medical);


// Rotas sem autenticação
router.use('/api/v1/users', userRoutes);

export default router;
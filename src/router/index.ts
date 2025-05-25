import express from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';
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
router.use('/api/v1/patients', authMiddleware, checkRole(['DOCTOR']), patientRoutes);
router.use('/api/v1/secretary', authMiddleware, checkRole(['DOCTOR']), secretaryRoutes);
router.use('/api/v1/doctors', authMiddleware, checkRole(['DOCTOR']), doctorRoutes);
router.use('/api/v1/specialties', specialtyRoutes);
router.use('/api/v1/medical-records', medical);


// Rotas sem autenticação
router.use('/api/v1/users', userRoutes);

export default router;
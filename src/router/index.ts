import express from 'express';
import { UserRole } from '../enums/UserRole';
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
router.use('/api/v1/patients', authMiddleware, checkRole([UserRole.ADMIN, UserRole.MASTER]), patientRoutes);
router.use('/api/v1/secretary', authMiddleware, checkRole([UserRole.ADMIN, UserRole.MASTER]), secretaryRoutes);
router.use('/api/v1/doctors', authMiddleware, checkRole([UserRole.ADMIN, UserRole.MASTER]), doctorRoutes);
router.use('/api/v1/specialties', authMiddleware, checkRole([UserRole.ADMIN, UserRole.MASTER]), specialtyRoutes);
router.use('/api/v1/medical-records', authMiddleware, checkRole([UserRole.ADMIN, UserRole.MASTER]), medical);


// Rotas sem autenticação
router.use('/api/v1/users', userRoutes);

export default router;
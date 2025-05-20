import express from 'express';
import { UserRole } from '../enums/UserRole';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './patientRoutes';
import secretaryRoutes from './secretaryRouter';
import specialtyRoutes from './specialtyRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api/v1/swagger-ui');
});

// Rotas autenticadas
router.use('/api/v1/patients', authMiddleware, checkRole([UserRole.ADMIN]), patientRoutes);
router.use('/api/v1/secretary', authMiddleware, checkRole([UserRole.ADMIN]), secretaryRoutes);
router.use('/api/v1/doctors', authMiddleware, checkRole([UserRole.ADMIN]), doctorRoutes);
router.use('/api/v1/specialties',specialtyRoutes);

// Rotas sem autenticação
router.use('/api/v1/users', userRoutes);

export default router;
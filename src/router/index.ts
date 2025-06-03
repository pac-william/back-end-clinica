import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import appointmentRoutes from './appointmentRoutes';
import doctorRoutes from './doctorRoutes';
import examRoutes from './examRoutes';
import healthRouter from './healthRouter';
import insuranceRoutes from './insuranceRoutes';
import medicalRecordRouter from './medicalRecordRoute';
import patientRoutes from './patientRoutes';
import paymentRoutes from './paymentRoutes';
import secretaryRouter from './secretaryRouter';
import specialtyRoutes from './specialtyRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API da Clínica rodando!',
    versao: '1.0.0',
    doc: '/docs'
  });
});

// Rotas autenticadas
router.use('/api/v1/patients', authMiddleware, patientRoutes);
router.use('/api/v1/secretaries', authMiddleware, secretaryRouter);
router.use('/api/v1/doctors', authMiddleware, doctorRoutes);
router.use('/api/v1/specialties', authMiddleware, specialtyRoutes);
router.use('/api/v1/medical-records', authMiddleware, medicalRecordRouter);
router.use('/api/v1/appointments', authMiddleware, appointmentRoutes);
router.use('/api/v1/payments', authMiddleware, paymentRoutes);
router.use('/api/v1/insurances', authMiddleware, insuranceRoutes);
router.use('/api/v1/exams', authMiddleware, examRoutes);

// Rotas sem autenticação
router.use('/api/v1/users', userRoutes);

// Rotas de saúde da API
router.use('/health', healthRouter);

export default router;
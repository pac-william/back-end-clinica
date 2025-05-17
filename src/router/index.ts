import express from 'express';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './pacienteRoutes';
import secretaryRoutes from './secretaryRouter';
import userRoutes from './userRoutes';
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api/v1/swagger-ui');
});

router.use('/api/v1/patients', patientRoutes);
router.use('/api/v1/secretary', secretaryRoutes);
router.use('/api/v1/doctors', doctorRoutes);
router.use('/api/v1/users', userRoutes);

export default router;
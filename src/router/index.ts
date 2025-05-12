import express from 'express';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './pacienteRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api/v1/swagger-ui');
});

router.use('/api/v1/patients', patientRoutes);
router.use('/api/v1/doctors', doctorRoutes);

export default router;
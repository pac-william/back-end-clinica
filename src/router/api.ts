import express from "express";
import patientRoutes from '../routes/pacienteRoutes';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/api/v1/swagger-ui')
});

router.use('/api/v1/patients', patientRoutes);

export default router;
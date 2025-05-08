import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'API rodando com sucess 🚀' });
});

export default router;
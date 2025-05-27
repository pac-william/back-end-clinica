import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

router.get('/health', async (req: Request, res: Response) => {
    await healthController.basicCheck(req, res);
});

router.get('/health/detailed', async (req: Request, res: Response) => {
    await healthController.detailedCheck(req, res);
});

export default router; 
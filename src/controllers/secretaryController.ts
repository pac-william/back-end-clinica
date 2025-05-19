import { Request, RequestHandler, Response } from 'express';
import { Secretary } from 'models/secretary';
import { ZodError } from 'zod';
import { secretaryDTO } from '../dtos/secretary.dto';
import SecretaryService from '../services/secretarysService';

const secretaryService = new SecretaryService();

class SecretaryController {

    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const secretaryBody = secretaryDTO.parse(req.body) as Secretary;

            const secretary = await secretaryService.create(secretaryBody);

            if (!secretary?.success) {
                res.status(400).json(secretary);
                return;
            }

            res.status(201).json({
                secretary: secretary.data
            });

        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    message: "invalid-request",
                    errors: err.issues
                });
            } else {
                res.status(500).json({
                    errors: err
                });
            }
        }
    };

    getAll: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const name = req.query.name as string | undefined;
        const email = req.query.email as string | undefined;
        const phone = req.query.phone as string | undefined;

        try {
            const secretaries = await secretaryService.getAllSecretaries(page, limit, name, email, phone);
            res.json(secretaries);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching secretaries.' });
        }
    };
}

export default SecretaryController;

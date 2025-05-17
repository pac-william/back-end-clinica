import { Request, RequestHandler, Response } from 'express';
import { Secretary } from 'models/secretary';
import { ZodError } from 'zod';
import { secretarySchema } from '../schemas/secretary.schema';
import SecretaryService from '../services/secretarysService';

const secretaryService = new SecretaryService();

class SecretaryController {

    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const secretaryBody = secretarySchema.parse(req.body) as Secretary;

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

        try {
            const { data, total } = await secretaryService.getAll(page, limit);
            const totalPages = Math.ceil(total / limit);

            if (page > totalPages && totalPages > 0) {
                const correctedPage = totalPages;
                const correctedData = await secretaryService.getAll(correctedPage, limit);
                res.json({
                    data: correctedData.data,
                    meta: {
                        page: correctedPage,
                        limit,
                        total,
                        totalPages,
                    },
                });
                return;
            }

            res.json({
                data,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching secretaries.' });
        }
    };
}

export default SecretaryController;

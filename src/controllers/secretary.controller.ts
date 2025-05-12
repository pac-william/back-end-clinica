
import { Request, RequestHandler, Response } from 'express';
import { secretarySchema } from '../schemas/secretary.schema';
import NursesService from 'services/secretarys.service';
import { ZodError } from 'zod';

class SecretaryController {
    private secretaryService: NursesService;

    constructor(secretaryService: NursesService) {
        this.secretaryService = secretaryService;
    }

    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const validation = secretarySchema.parse(req.body);
            res.status(201).json(validation);
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
            const { data, total } = await this.secretaryService.getAll(page, limit);
            const totalPages = Math.ceil(total / limit);
    
            if (page > totalPages && totalPages > 0) {
                const correctedPage = totalPages;
                const correctedData = await this.secretaryService.getAll(correctedPage, limit);
                res.json({
                    data: correctedData.data,
                    meta: {
                        page: correctedPage,
                        limit,
                        total,
                        totalPages,
                    },
                });
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
            res.status(500).json({ message: 'Erro ao buscar enfermeiros.' });
        }
    };
}

export default SecretaryController;

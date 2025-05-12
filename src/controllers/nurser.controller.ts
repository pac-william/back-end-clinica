
import { Request, RequestHandler, Response } from 'express';
import { Nurse } from 'models/nurse';
import NursesService from 'services/nurser.service';

class NursesController {
    private nursesService: NursesService;

    constructor(nursesService: NursesService) {
        this.nursesService = nursesService;
    }

    create: RequestHandler = async (req: Request, res: Response) => {
        res.json({ teste: 'ok' });
    };

    getAll: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        try {
            const { data, total } = await this.nursesService.getAll(page, limit);
            const totalPages = Math.ceil(total / limit);
    
            if (page > totalPages && totalPages > 0) {
                const correctedPage = totalPages;
                const correctedData = await this.nursesService.getAll(correctedPage, limit);
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

export default NursesController;


import { Request, RequestHandler, Response } from 'express';
import { secretarySchema } from '../schemas/secretary.schema';
import SecretaryService from 'services/secretarys.service';
import UserService from '../services/userService';
import { ZodError } from 'zod';
import { Secretary } from 'models/secretary';

class SecretaryController {
    private secretaryService: SecretaryService;
    private userService: UserService; 

    constructor(secretaryService: SecretaryService,userService: UserService) {
        this.secretaryService = secretaryService;
        this.userService = userService;
    }

    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const secretaryBody = secretarySchema.parse(req.body) as Secretary;
            const { login, senha } = req.body;

            const secretary = await this.secretaryService.create(secretaryBody);

            if (!secretary?.success) {
            res.status(400).json(secretary);
            return;
            }

            const secretaryId = secretary.data.id; 

            const user = await this.userService.createUser({login,senha,role:'SECRETARY',role_id: secretaryId});

            if (!user.success) {
            res.status(400).json(user);
            return;
            }

            res.status(201).json({
            secretary: secretary.data,
            user: user.dados
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

import { Request, RequestHandler, Response } from 'express';
import { Secretary } from 'models/secretary';
import { ZodError } from 'zod';
import { secretaryDTO } from '../dtos/secretary.dto';
import SecretaryService from '../services/secretarysService';

const secretaryService = new SecretaryService();

// Controller responsável pelas operações relacionadas às secretárias
class SecretaryController {
    /**
     * Cria uma nova secretária.
     * @param req Requisição HTTP (deve conter os dados da secretária no body)
     * @param res Resposta HTTP
     * @returns A secretária criada ou erro de validação
     */
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

    /**
     * Lista secretárias com filtros e paginação.
     * @param req Requisição HTTP (deve conter os parâmetros de paginação e filtros)
     * @param res Resposta HTTP
     * @returns Lista de secretárias
     */
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

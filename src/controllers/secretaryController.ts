import { Request, RequestHandler, Response } from 'express';
import { Secretary } from 'models/secretary';
import { ZodError } from 'zod';
import { secretaryDTO } from '../dtos/secretary.dto';
import SecretaryService from '../services/secretarysService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryParamsBuilder } from '../utils/QueryBuilder';

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

            if (secretary instanceof ErrorResponse) {
                res.status(secretary.statusCode).json({ message: secretary.message });
                return;
            }

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
        const { page, size, name, email, phone } = QueryParamsBuilder.from(req.query)
            .withNumber('page', 1)
            .withNumber('size', 10)
            .withString('name')
            .withString('email')
            .withString('phone')
            .build();

        try {
            const secretaries = await secretaryService.getAllSecretaries(page, size, name, email, phone);
            res.json(secretaries);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching secretaries.' });
        }
    };

    /**
     * Busca uma secretária pelo id.
     * @param req Requisição HTTP (deve conter o id da secretária na URL)
     * @param res Resposta HTTP
     * @returns A secretária encontrada ou erro
     */
    getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;

        try {
            const secretary = await secretaryService.getById(id);

            if (secretary instanceof ErrorResponse) {
                res.status(secretary.statusCode).json({ message: secretary.message });
                return;
            }

            res.json(secretary);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar secretária.' });
        }
    };

    /**
     * Atualiza os dados de uma secretária existente.
     * @param req Requisição HTTP (deve conter o id da secretária na URL e os dados atualizados no body)
     * @param res Resposta HTTP
     * @returns A secretária atualizada ou erro
     */
    update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { name, email, phone } = req.body;

        try {
            const secretary = await secretaryService.update(id, name, email, phone);

            if (secretary instanceof ErrorResponse) {
                res.status(secretary.statusCode).json({ message: secretary.message });
                return;
            }

            res.json(secretary);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar secretária.' });
        }
    };

    /**
     * Remove uma secretária pelo id.
     * @param req Requisição HTTP (deve conter o id da secretária na URL)
     * @param res Resposta HTTP
     * @returns Resultado da operação ou erro
     */
    delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;

        try {
            const result = await secretaryService.delete(id);

            if (result instanceof ErrorResponse) {
                res.status(result.statusCode).json({ message: result.message });
                return;
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir secretária.' });
        }
    };
}

export default SecretaryController;

import { Request, RequestHandler, Response } from 'express';
import SpecialtyService from "../services/specialtyService";

const specialtyService = new SpecialtyService();

// Controller responsável pelas operações relacionadas às especialidades
class SpecialtyController {

    /**
     * Cria uma nova especialidade.
     * @param req Requisição HTTP (deve conter o nome da especialidade no body)
     * @param res Resposta HTTP
     * @returns A especialidade criada ou erro de validação
     */
    createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { name } = req.body;

        if (name && name.length < 3) {
            res.status(400).json({ error: 'Name must be at least 3 characters long' });
            return;
        }

        const user = await specialtyService.createUser({ name });
        res.status(201).json(user);
    };

    /**
     * Lista especialidades com filtros e paginação.
     * @param req Requisição HTTP (deve conter os parâmetros de paginação e filtros)
     * @param res Resposta HTTP
     * @returns Lista de especialidades
     */
    getAll: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const name = req.query.name as string | undefined;

            const specialties = await specialtyService.getAll(page, limit, name);
            res.json(specialties);
        } catch (error: any) {

            res.status(500).json({ error: 'Failed to retrieve specialties' });
        }
    };

    /**
     * Busca uma especialidade pelo id.
     * @param req Requisição HTTP (deve conter o id nos parâmetros)
     * @param res Resposta HTTP
     * @returns A especialidade encontrada ou 404 se não existir
     */
    getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const specialty = await specialtyService.getById(Number(id));

        if (!specialty) {
            res.status(404).json({ error: 'Specialty not found' });
            return;
        }

        res.json(specialty);
    };

    /**
     * Atualiza os dados de uma especialidade existente.
     * @param req Requisição HTTP (deve conter o id nos parâmetros e o nome no body)
     * @param res Resposta HTTP
     * @returns A especialidade atualizada ou 404 se não existir
     */
    update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name } = req.body;

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        if (name && name.length < 3) {
            res.status(400).json({ error: 'Name must be at least 3 characters long' });
            return;
        }

        const specialty = await specialtyService.update(Number(id), { name });

        if (!specialty) {
            res.status(404).json({ error: 'Specialty not found' });
            return;
        }

        res.json(specialty);
    };

    /**
     * Remove uma especialidade pelo id.
     * @param req Requisição HTTP (deve conter o id nos parâmetros)
     * @param res Resposta HTTP
     * @returns Mensagem de sucesso ou erro
     */
    delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const specialty = await specialtyService.delete(Number(id));

        if (!specialty) {
            res.status(404).json({ error: 'Specialty not found' });
            return;
        }

        res.json({ message: 'Specialty deleted successfully' });
    };


}
export default SpecialtyController;
import { Request, RequestHandler, Response } from 'express';
import { userDTO } from '../dtos/user.dto';
import UserService from '../services/userService';
import { QueryParamsBuilder } from '../utils/QueryParamsBuilder';

const userService = new UserService();

// Controller responsável pelas operações relacionadas aos usuários
class UserController {
    /**
     * Lista usuários com filtros e paginação.
     * @param req Requisição HTTP (deve conter os parâmetros de paginação e filtros)
     * @param res Resposta HTTP
     * @returns Lista de usuários
     */
    getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, limit, email, role } = QueryParamsBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('limit', 10)
                .withString('email')
                .withString('role')
                .build();

            const users = await userService.getAllUsers(page, limit, email, role);

            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    };

    /**
     * Cria um novo usuário.
     * @param req Requisição HTTP (deve conter os dados do usuário no body)
     * @param res Resposta HTTP
     * @returns O usuário criado ou erro de validação
     */
    createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            // Se role não for fornecida, define como 'USER' por padrão
            if (!req.body.role) {
                req.body.role = 'USER';
            }
            
            req.body = userDTO.parse(req.body);
            const { email, password, role } = req.body;
            const token = req.headers.authorization?.split(' ')[1];
            
            // Se for criar um usuário normal e não tiver token, prossegue sem token
            if (role === 'USER' && !token) {
                const user = await userService.createUser({ email, password, role });
                res.status(201).json(user);
                return;
            }
            
            const user = await userService.createUser({ email, password, role }, token);
            res.status(201).json(user);
        } catch (error: any) {
            if (error.message === 'Token não fornecido') {
                res.status(401).json({ error: error.message });
            } else if (error.message === 'Permissão negada para criar este tipo de usuário') {
                res.status(403).json({ error: error.message });
            } else if (error.message === 'Token inválido') {
                res.status(401).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message || 'Falha ao criar usuário' });
            }
        }
    };

    /**
     * Realiza o login de um usuário.
     * @param req Requisição HTTP (deve conter email e senha no body)
     * @param res Resposta HTTP
     * @returns Token de autenticação ou erro de login
     */
    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const user = await userService.login({ email, password });
        res.status(200).json(user);
    };
}

export default UserController;
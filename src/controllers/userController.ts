import { userDTO } from 'dtos/user.dto';
import { Request, RequestHandler, Response } from 'express';
import UserService from '../services/userService';
import { QueryBuilder } from '../utils/QueryBuilder';

const userService = new UserService();

class UserController {
    getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, limit, email, role } = QueryBuilder.from(req.query)
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

    createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            req.body = userDTO.parse(req.body);
            const { email, password, role } = req.body;
            const token = req.headers.authorization?.split(' ')[1];
            
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
                res.status(400).json({ error: 'Falha ao criar usuário' });
            }
        }
    };

    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const user = await userService.login({ email, password });
        res.status(200).json(user);
    };
}

export default UserController;
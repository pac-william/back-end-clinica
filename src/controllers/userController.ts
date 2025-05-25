import { Request, RequestHandler, Response } from 'express';
import UserService from '../services/userService';

const userService = new UserService();

class UserController {
    getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const email = req.query.email as string | undefined;
            const role = req.query.role as string | undefined;

            const users = await userService.getAllUsers(page, limit, email, role);
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    };

    createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, password, role, role_id } = req.body;

        if (role != 'DOCTOR' && role != 'SECRETARY' && role != 'PATIENT') {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }

        const user = await userService.createUser({ email, password, role, role_id });
        res.status(201).json(user);
    };

    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const user = await userService.login({ email, password });
        res.status(200).json(user);
    };
}

export default UserController;
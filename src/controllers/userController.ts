import { Request, Response } from 'express';
import UserService from '../services/userService';

const userService = new UserService();

class UserController {
    async createUser(req: Request, res: Response) {
        const { email, password, role, role_id } = req.body;
        const user = await userService.createUser({ email, password, role, role_id });
        res.status(201).json(user);
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await userService.login({ email, password });
        res.status(200).json(user);
    }
}

export default UserController;
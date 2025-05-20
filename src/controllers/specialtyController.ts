import { Request, RequestHandler, Response } from 'express';
import SpecialtyService from "../services/specialty.service";

const specialtyService = new SpecialtyService();


class SpecialtyController {

  createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
      const {name} = req.body;

      if (name && name.length < 3) {
          res.status(400).json({ error: 'Name must be at least 3 characters long' });
          return;
      }

      const user = await specialtyService.createUser({ name });
      res.status(201).json(user);
  };

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


}
export default SpecialtyController;
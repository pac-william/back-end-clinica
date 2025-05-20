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


}
export default SpecialtyController;
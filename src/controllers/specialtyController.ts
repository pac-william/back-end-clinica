import { Request, Response } from "express";
import { createSpecialtyDTO } from "../dtos/specialty.dto";
import SpecialtyService from "../services/specialty.service";

export default class SpecialtyController {
  private service = new SpecialtyService();

  create(req: Request, res: Response) {
    const parseResult = createSpecialtyDTO.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.format() });
    }

    const specialty = this.service.create(parseResult.data);
    return res.status(201).json(specialty);
  }

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const parseResult = createSpecialtyDTO.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.format() });
    }

    const specialty = this.service.update(id, parseResult.data);
    if (!specialty) return res.status(404).json({ error: "Especialidade não encontrada." });

    return res.json(specialty);
  }

  findAll(req: Request, res: Response) {
    const specialties = this.service.findAll();
    return res.json(specialties);
  }

  findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const specialty = this.service.findById(id);
    if (!specialty) return res.status(404).json({ error: "Especialidade não encontrada." });

    return res.json(specialty);
  }
}

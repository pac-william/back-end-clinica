import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { DoctorDTO } from '../dtos/doctor.dto';
import DoctorService from '../services/doctorService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryBuilder } from '../utils/QueryBuilder';

const doctorService = new DoctorService();

class DoctorController {
  /**
   * Lista todos os médicos, com filtros opcionais por especialidade, nome, paginação, etc.
   * @param req Requisição HTTP contendo possíveis filtros na query
   * @param res Resposta HTTP com a lista de médicos
   */
  getAllDoctors: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withArray('specialty')
        .withString('name')
        .build();

      const doctors = await doctorService.getAllDoctors(filters);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar médicos', error });
    }
  };

  /**
   * Busca um médico específico pelo seu id.
   * @param req Requisição HTTP contendo o id do médico nos parâmetros
   * @param res Resposta HTTP com o médico encontrado ou erro 404
   */
  getDoctorById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctor = await doctorService.getDoctorById(id);

      if (doctor instanceof ErrorResponse) {
        res.status(doctor.statusCode).json(doctor);
        return;
      }

      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar médico', error });
    }
  };

  /**
   * Cria um novo médico no sistema.
   * @param req Requisição HTTP contendo os dados do médico no body
   * @param res Resposta HTTP com o médico criado ou erros de validação
   */
  createDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      const doctor = DoctorDTO.parse(req.body);
      const created = await doctorService.createDoctor(doctor);

      if (created instanceof ErrorResponse) {
        res.status(created.statusCode).json(created);
        return;
      }

      res.status(201).json({ doctor: created });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao criar médico', error: err });
      }
    }
  };

  /**
   * Atualiza os dados de um médico existente.
   * @param req Requisição HTTP contendo o id do médico nos parâmetros e os novos dados no body
   * @param res Resposta HTTP com o médico atualizado ou erros de validação
   */
  updateDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      const doctor = DoctorDTO.parse(req.body);
      const { id } = req.params;

      const updated = await doctorService.updateDoctor(id, doctor);

      if (updated instanceof ErrorResponse) {
        res.status(updated.statusCode).json(updated);
        return;
      }

      res.json(updated);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar médico', error: err });
      }
    }
  };

  /**
   * Remove um médico do sistema pelo seu id.
   * @param req Requisição HTTP contendo o id do médico nos parâmetros
   * @param res Resposta HTTP confirmando a exclusão
   */
  deleteDoctor: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await doctorService.deleteDoctor(id);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Médico removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar médico', error });
    }
  };
}

export default DoctorController;
import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { ExamDTO } from '../dtos/exam.dto';
import ExamService from '../services/examService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryParamsBuilder } from '../utils/QueryBuilder';

const examService = new ExamService();

class ExamController {
  /**
   * Lista todos os exames, com filtros opcionais.
   * @param req Requisição HTTP contendo possíveis filtros na query
   * @param res Resposta HTTP com a lista de exames
   */
  getAllExams: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryParamsBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withNumber('patientId')
        .withNumber('doctorId')
        .withString('status')
        .withString('type')
        .withString('startDate')
        .withString('endDate')
        .build();

      const exams = await examService.getAllExams(filters);
      
      if (exams instanceof ErrorResponse) {
        res.status(exams.statusCode).json(exams);
        return;
      }
      
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar exames', error });
    }
  };

  /**
   * Busca um exame específico pelo seu id.
   * @param req Requisição HTTP contendo o id do exame nos parâmetros
   * @param res Resposta HTTP com o exame encontrado ou erro 404
   */
  getExamById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exam = await examService.getExamById(id);

      if (exam instanceof ErrorResponse) {
        res.status(exam.statusCode).json(exam);
        return;
      }

      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar exame', error });
    }
  };

  /**
   * Busca exames de um paciente específico.
   * @param req Requisição HTTP contendo o id do paciente nos parâmetros
   * @param res Resposta HTTP com os exames encontrados
   */
  getExamsByPatientId: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      const exams = await examService.getExamsByPatientId(Number(patientId));

      if (exams instanceof ErrorResponse) {
        res.status(exams.statusCode).json(exams);
        return;
      }

      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar exames do paciente', error });
    }
  };

  /**
   * Cria um novo exame no sistema.
   * @param req Requisição HTTP contendo os dados do exame no body
   * @param res Resposta HTTP com o exame criado ou erros de validação
   */
  createExam: RequestHandler = async (req: Request, res: Response) => {
    try {
      const parsedExam = ExamDTO.parse(req.body);
      const exam = await examService.createExam(parsedExam);

      if (exam instanceof ErrorResponse) {
        res.status(exam.statusCode).json(exam);
        return;
      }

      res.status(201).json(exam);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao criar exame', error: err });
      }
    }
  };

  /**
   * Atualiza parcialmente os dados de um exame existente.
   * @param req Requisição HTTP contendo o id do exame nos parâmetros e os dados parciais no body
   * @param res Resposta HTTP com o exame atualizado ou erros de validação
   */
  updateExam: RequestHandler = async (req: Request, res: Response) => {
    try {
      const exam = ExamDTO.partial().parse(req.body);
      const { id } = req.params;

      const updated = await examService.updateExam(id, exam);

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
        res.status(500).json({ message: 'Erro ao atualizar exame', error: err });
      }
    }
  };

  /**
   * Atualiza o status de um exame existente.
   * @param req Requisição HTTP contendo o id do exame nos parâmetros e o status no query
   * @param res Resposta HTTP com o resultado da operação
   */
  updateExamStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.query as { status: string };

      if (!status) {
        res.status(400).json({ message: 'Status não fornecido' });
        return;
      }

      const result = await examService.updateExamStatus(id, status);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Status do exame atualizado com sucesso', exam: result });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar status do exame', error });
    }
  };

  /**
   * Atualiza o resultado de um exame existente.
   * @param req Requisição HTTP contendo o id do exame nos parâmetros e o resultado no body
   * @param res Resposta HTTP com o resultado da operação
   */
  updateExamResult: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { result } = req.body;

      if (!result) {
        res.status(400).json({ message: 'Resultado não fornecido' });
        return;
      }

      const updated = await examService.updateExamResult(id, result);

      if (updated instanceof ErrorResponse) {
        res.status(updated.statusCode).json(updated);
        return;
      }

      res.json({ message: 'Resultado do exame atualizado com sucesso', exam: updated });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar resultado do exame', error });
    }
  };

  /**
   * Remove um exame do sistema pelo seu id (soft delete).
   * @param req Requisição HTTP contendo o id do exame nos parâmetros
   * @param res Resposta HTTP confirmando a exclusão
   */
  deleteExam: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await examService.deleteExam(id);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Exame cancelado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cancelar exame', error });
    }
  };
}

export default ExamController; 
import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { InsuranceDTO } from '../dtos/insurance.dto';
import InsuranceService from '../services/insuranceService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryParamsBuilder } from '../utils/QueryBuilder';

const insuranceService = new InsuranceService();

class InsuranceController {
  /**
   * Lista todos os convênios, com filtro opcional por nome.
   * @param req Requisição HTTP contendo possíveis filtros na query
   * @param res Resposta HTTP com a lista de convênios
   */
  getAllInsurances: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryParamsBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withString('name')
        .build();

      const insurances = await insuranceService.getAllInsurances(filters);
      
      if (insurances instanceof ErrorResponse) {
        res.status(insurances.statusCode).json(insurances);
        return;
      }
      
      res.json(insurances);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar convênios', error });
    }
  };

  /**
   * Lista todos os convênios sem paginação (para uso em selects).
   * @param req Requisição HTTP
   * @param res Resposta HTTP com a lista de convênios
   */
  getAllInsurancesWithoutPagination: RequestHandler = async (req: Request, res: Response) => {
    try {
      const insurances = await insuranceService.getAllInsurancesWithoutPagination();
      
      if (insurances instanceof ErrorResponse) {
        res.status(insurances.statusCode).json(insurances);
        return;
      }
      
      res.json(insurances);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar convênios', error });
    }
  };

  /**
   * Busca um convênio específico pelo seu id.
   * @param req Requisição HTTP contendo o id do convênio nos parâmetros
   * @param res Resposta HTTP com o convênio encontrado ou erro 404
   */
  getInsuranceById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const insurance = await insuranceService.getInsuranceById(id);

      if (insurance instanceof ErrorResponse) {
        res.status(insurance.statusCode).json(insurance);
        return;
      }

      res.json(insurance);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar convênio', error });
    }
  };

  /**
   * Cria um novo convênio no sistema.
   * @param req Requisição HTTP contendo os dados do convênio no body
   * @param res Resposta HTTP com o convênio criado ou erros de validação
   */
  createInsurance: RequestHandler = async (req: Request, res: Response) => {
    try {
      const parsedInsurance = InsuranceDTO.parse(req.body);
      const insurance = await insuranceService.createInsurance(parsedInsurance);

      if (insurance instanceof ErrorResponse) {
        res.status(insurance.statusCode).json(insurance);
        return;
      }

      res.status(201).json(insurance);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao criar convênio', error: err });
      }
    }
  };

  /**
   * Atualiza parcialmente os dados de um convênio existente.
   * @param req Requisição HTTP contendo o id do convênio nos parâmetros e os dados parciais no body
   * @param res Resposta HTTP com o convênio atualizado ou erros de validação
   */
  updateInsurance: RequestHandler = async (req: Request, res: Response) => {
    try {
      const insurance = InsuranceDTO.partial().parse(req.body);
      const { id } = req.params;

      const updated = await insuranceService.updateInsurance(id, insurance);

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
        res.status(500).json({ message: 'Erro ao atualizar convênio', error: err });
      }
    }
  };

  /**
   * Remove um convênio do sistema pelo seu id (soft delete).
   * @param req Requisição HTTP contendo o id do convênio nos parâmetros
   * @param res Resposta HTTP confirmando a exclusão
   */
  deleteInsurance: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await insuranceService.deleteInsurance(id);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Convênio removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover convênio', error });
    }
  };
}

export default InsuranceController; 
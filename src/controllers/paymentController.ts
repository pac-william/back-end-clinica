import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { PaymentDTO } from '../dtos/payment.dto';
import PaymentService from '../services/paymentService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryParamsBuilder } from '../utils/QueryParamsBuilder';

const paymentService = new PaymentService();

class PaymentController {
  /**
   * Lista todos os pagamentos, com filtros opcionais.
   * @param req Requisição HTTP contendo possíveis filtros na query
   * @param res Resposta HTTP com a lista de pagamentos
   */
  getAllPayments: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryParamsBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withNumber('appointmentId')
        .withString('status')
        .withString('startDate')
        .withString('endDate')
        .build();

      const payments = await paymentService.getAllPayments(filters);
      
      if (payments instanceof ErrorResponse) {
        res.status(payments.statusCode).json(payments);
        return;
      }
      
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar pagamentos', error });
    }
  };

  /**
   * Busca um pagamento específico pelo seu id.
   * @param req Requisição HTTP contendo o id do pagamento nos parâmetros
   * @param res Resposta HTTP com o pagamento encontrado ou erro 404
   */
  getPaymentById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);

      if (payment instanceof ErrorResponse) {
        res.status(payment.statusCode).json(payment);
        return;
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar pagamento', error });
    }
  };

  /**
   * Busca pagamentos por ID de consulta.
   * @param req Requisição HTTP contendo o id da consulta nos parâmetros
   * @param res Resposta HTTP com os pagamentos encontrados
   */
  getPaymentsByAppointmentId: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { appointmentId } = req.params;
      const payments = await paymentService.getPaymentsByAppointmentId(Number(appointmentId));

      if (payments instanceof ErrorResponse) {
        res.status(payments.statusCode).json(payments);
        return;
      }

      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar pagamentos da consulta', error });
    }
  };

  /**
   * Cria um novo pagamento no sistema.
   * @param req Requisição HTTP contendo os dados do pagamento no body
   * @param res Resposta HTTP com o pagamento criado ou erros de validação
   */
  createPayment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const parsedPayment = PaymentDTO.parse(req.body);
      const payment = await paymentService.createPayment(parsedPayment);

      if (payment instanceof ErrorResponse) {
        res.status(payment.statusCode).json(payment);
        return;
      }

      res.status(201).json(payment);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao criar pagamento', error: err });
      }
    }
  };

  /**
   * Atualiza parcialmente os dados de um pagamento existente.
   * @param req Requisição HTTP contendo o id do pagamento nos parâmetros e os dados parciais no body
   * @param res Resposta HTTP com o pagamento atualizado ou erros de validação
   */
  updatePayment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const payment = PaymentDTO.partial().parse(req.body);
      const { id } = req.params;

      const updated = await paymentService.updatePayment(id, payment);

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
        res.status(500).json({ message: 'Erro ao atualizar pagamento', error: err });
      }
    }
  };

  /**
   * Atualiza o status de um pagamento existente.
   * @param req Requisição HTTP contendo o id do pagamento nos parâmetros e o status no query
   * @param res Resposta HTTP com o resultado da operação
   */
  updatePaymentStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.query as { status: string };

      if (!status) {
        res.status(400).json({ message: 'Status não fornecido' });
        return;
      }

      const result = await paymentService.updatePaymentStatus(id, status);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Status do pagamento atualizado com sucesso', payment: result });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar status do pagamento', error });
    }
  };

  /**
   * Remove um pagamento do sistema pelo seu id (soft delete).
   * @param req Requisição HTTP contendo o id do pagamento nos parâmetros
   * @param res Resposta HTTP confirmando a exclusão
   */
  deletePayment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await paymentService.deletePayment(id);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Pagamento estornado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao estornar pagamento', error });
    }
  };
}

export default PaymentController; 
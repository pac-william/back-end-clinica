import { Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { AppointmentDTO } from '../dtos/appointment.dto';
import AppointmentService from '../services/appointmentService';
import { ErrorResponse } from '../utils/ErrorResponse';
import { QueryParamsBuilder } from '../utils/QueryBuilder';

const appointmentService = new AppointmentService();

class AppointmentController {
  /**
   * Lista todas as consultas, com filtros opcionais.
   * @param req Requisição HTTP contendo possíveis filtros na query
   * @param res Resposta HTTP com a lista de consultas
   */
  getAllAppointments: RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = QueryParamsBuilder.from(req.query)
        .withNumber('page', 1)
        .withNumber('size', 10)
        .withNumber('patientId')
        .withNumber('doctorId')
        .withString('status')
        .withString('startDate')
        .withString('endDate')
        .build();

      const appointments = await appointmentService.getAllAppointments(filters);
      
      if (appointments instanceof ErrorResponse) {
        res.status(appointments.statusCode).json(appointments);
        return;
      }
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar consultas', error });
    }
  };

  /**
   * Busca uma consulta específica pelo seu id.
   * @param req Requisição HTTP contendo o id da consulta nos parâmetros
   * @param res Resposta HTTP com a consulta encontrada ou erro 404
   */
  getAppointmentById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      if (appointment instanceof ErrorResponse) {
        res.status(appointment.statusCode).json(appointment);
        return;
      }

      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao buscar consulta', error });
    }
  };

  /**
   * Cria uma nova consulta no sistema.
   * @param req Requisição HTTP contendo os dados da consulta no body
   * @param res Resposta HTTP com a consulta criada ou erros de validação
   */
  createAppointment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const parsedAppointment = AppointmentDTO.parse(req.body);
      const appointment = await appointmentService.createAppointment(parsedAppointment);

      if (appointment instanceof ErrorResponse) {
        res.status(appointment.statusCode).json(appointment);
        return;
      }

      res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Requisição inválida',
          errors: err.issues,
        });
      } else {
        res.status(500).json({ message: 'Erro ao criar consulta', error: err });
      }
    }
  };

  /**
   * Atualiza parcialmente os dados de uma consulta existente.
   * @param req Requisição HTTP contendo o id da consulta nos parâmetros e os dados parciais no body
   * @param res Resposta HTTP com a consulta atualizada ou erros de validação
   */
  updateAppointment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const appointment = AppointmentDTO.partial().parse(req.body);
      const { id } = req.params;

      const updated = await appointmentService.updateAppointment(id, appointment);

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
        res.status(500).json({ message: 'Erro ao atualizar consulta', error: err });
      }
    }
  };

  /**
   * Atualiza o status de uma consulta existente.
   * @param req Requisição HTTP contendo o id da consulta nos parâmetros e o status no query
   * @param res Resposta HTTP com o resultado da operação
   */
  updateAppointmentStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.query as { status: string };

      if (!status) {
        res.status(400).json({ message: 'Status não fornecido' });
        return;
      }

      const result = await appointmentService.updateAppointmentStatus(id, status);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Status da consulta atualizado com sucesso', appointment: result });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar status da consulta', error });
    }
  };

  /**
   * Remove uma consulta do sistema pelo seu id (soft delete).
   * @param req Requisição HTTP contendo o id da consulta nos parâmetros
   * @param res Resposta HTTP confirmando a exclusão
   */
  deleteAppointment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await appointmentService.deleteAppointment(id);

      if (result instanceof ErrorResponse) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.json({ message: 'Consulta cancelada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cancelar consulta', error });
    }
  };
}

export default AppointmentController; 
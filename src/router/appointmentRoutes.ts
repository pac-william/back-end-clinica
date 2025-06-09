import express from 'express';
import AppointmentController from '../controllers/appointmentController';
import { UserRole } from '../enums/UserRole';
import { checkRole } from '../middleware/auth.middleware';

const router = express.Router();
const appointmentController = new AppointmentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da consulta
 *         patientId:
 *           type: integer
 *           description: ID do paciente
 *         doctorId:
 *           type: integer
 *           description: ID do médico
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora da consulta
 *         status:
 *           type: string
 *           enum: [SCHEDULED, CONFIRMED, CANCELLED, COMPLETED]
 *           description: Status da consulta
 */

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Retorna todas as consultas
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *         description: Filtrar consultas por paciente
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *         description: Filtrar consultas por médico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, CONFIRMED, CANCELLED, COMPLETED]
 *         description: Filtrar consultas por status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de consultas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', checkRole([UserRole.USER, UserRole.ADMIN, UserRole.MASTER]), appointmentController.getAllAppointments);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Retorna uma consulta pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Consulta não encontrada
 */
router.get('/:id', checkRole([UserRole.USER, UserRole.ADMIN, UserRole.MASTER]), appointmentController.getAppointmentById);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Cria uma nova consulta
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T10:30:00Z"
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, CONFIRMED, CANCELLED, COMPLETED]
 *                 example: "SCHEDULED"
 *             required:
 *               - patientId
 *               - doctorId
 *               - date
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma consulta
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Consulta não encontrada
 */
router.patch('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), appointmentController.updateAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma consulta
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, CONFIRMED, CANCELLED, COMPLETED]
 *         required: true
 *         description: Novo status da consulta
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Consulta não encontrada
 */
router.patch('/:id/status', checkRole([UserRole.ADMIN, UserRole.MASTER]), appointmentController.updateAppointmentStatus);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   delete:
 *     summary: Cancela uma consulta (soft delete)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso
 *       404:
 *         description: Consulta não encontrada
 */
router.delete('/:id', checkRole([UserRole.MASTER]), appointmentController.deleteAppointment);

export default router; 
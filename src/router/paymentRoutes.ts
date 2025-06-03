import express from 'express';
import PaymentController from '../controllers/paymentController';
import { UserRole } from '../enums/UserRole';
import { checkRole } from '../middleware/auth.middleware';

const router = express.Router();
const paymentController = new PaymentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - appointmentId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do pagamento
 *         appointmentId:
 *           type: integer
 *           description: ID da consulta associada
 *         amount:
 *           type: number
 *           format: float
 *           description: Valor do pagamento
 *         paymentMethod:
 *           type: string
 *           enum: [DINHEIRO, CARTAO_CREDITO, CARTAO_DEBITO, PIX, CONVENIO]
 *           description: Método de pagamento
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora do pagamento
 *         status:
 *           type: string
 *           enum: [PENDENTE, APROVADO, RECUSADO, ESTORNADO]
 *           description: Status do pagamento
 *         insuranceId:
 *           type: integer
 *           description: ID do convênio (se aplicável)
 */

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Retorna todos os pagamentos
 *     tags: [Payments]
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
 *         name: appointmentId
 *         schema:
 *           type: integer
 *         description: Filtrar pagamentos por consulta
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, RECUSADO, ESTORNADO]
 *         description: Filtrar pagamentos por status
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
 *         description: Lista de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
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
router.get('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.getAllPayments);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Retorna um pagamento pelo ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Pagamento não encontrado
 */
router.get('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.getPaymentById);

/**
 * @swagger
 * /api/v1/payments/appointment/{appointmentId}:
 *   get:
 *     summary: Retorna pagamentos por ID de consulta
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Lista de pagamentos da consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Consulta não encontrada
 */
router.get('/appointment/:appointmentId', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.getPaymentsByAppointmentId);

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *               paymentMethod:
 *                 type: string
 *                 enum: [DINHEIRO, CARTAO_CREDITO, CARTAO_DEBITO, PIX, CONVENIO]
 *                 example: "CARTAO_CREDITO"
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T10:30:00Z"
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, APROVADO, RECUSADO, ESTORNADO]
 *                 example: "PENDENTE"
 *               insuranceId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - appointmentId
 *               - amount
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.createPayment);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um pagamento
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pagamento
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               paymentMethod:
 *                 type: string
 *                 enum: [DINHEIRO, CARTAO_CREDITO, CARTAO_DEBITO, PIX, CONVENIO]
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, APROVADO, RECUSADO, ESTORNADO]
 *               insuranceId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pagamento não encontrado
 */
router.patch('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.updatePayment);

/**
 * @swagger
 * /api/v1/payments/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pagamento
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pagamento
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, RECUSADO, ESTORNADO]
 *         required: true
 *         description: Novo status do pagamento
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pagamento não encontrado
 */
router.patch('/:id/status', checkRole([UserRole.ADMIN, UserRole.MASTER]), paymentController.updatePaymentStatus);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   delete:
 *     summary: Estorna um pagamento (soft delete)
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento estornado com sucesso
 *       404:
 *         description: Pagamento não encontrado
 */
router.delete('/:id', checkRole([UserRole.MASTER]), paymentController.deletePayment);

export default router; 
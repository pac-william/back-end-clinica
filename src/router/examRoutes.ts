import express from 'express';
import ExamController from '../controllers/examController';
import { UserRole } from '../enums/UserRole';
import { checkRole } from '../middleware/auth.middleware';

const router = express.Router();
const examController = new ExamController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - type
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do exame
 *         patientId:
 *           type: integer
 *           description: ID do paciente
 *         doctorId:
 *           type: integer
 *           description: ID do médico que solicitou o exame
 *         type:
 *           type: string
 *           description: Tipo de exame
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do exame
 *         result:
 *           type: string
 *           description: Resultado do exame
 *         status:
 *           type: string
 *           enum: [SOLICITADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *           description: Status do exame
 */

/**
 * @swagger
 * /api/v1/exams:
 *   get:
 *     summary: Retorna todos os exames
 *     tags: [Exams]
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
 *         description: Filtrar exames por paciente
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *         description: Filtrar exames por médico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SOLICITADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *         description: Filtrar exames por status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar exames por tipo
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
 *         description: Lista de exames
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
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
router.get('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.getAllExams);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   get:
 *     summary: Retorna um exame pelo ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do exame
 *     responses:
 *       200:
 *         description: Exame encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       404:
 *         description: Exame não encontrado
 */
router.get('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.getExamById);

/**
 * @swagger
 * /api/v1/exams/patient/{patientId}:
 *   get:
 *     summary: Retorna exames de um paciente específico
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Lista de exames do paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/patient/:patientId', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.getExamsByPatientId);

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     summary: Cria um novo exame
 *     tags: [Exams]
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
 *               type:
 *                 type: string
 *                 example: "Hemograma Completo"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T10:30:00Z"
 *               result:
 *                 type: string
 *                 example: ""
 *               status:
 *                 type: string
 *                 enum: [SOLICITADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *                 example: "SOLICITADO"
 *             required:
 *               - patientId
 *               - doctorId
 *               - type
 *               - date
 *     responses:
 *       201:
 *         description: Exame criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.createExam);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um exame
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do exame
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
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               result:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [SOLICITADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Exame atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Exame não encontrado
 */
router.patch('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.updateExam);

/**
 * @swagger
 * /api/v1/exams/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um exame
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do exame
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SOLICITADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *         required: true
 *         description: Novo status do exame
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Exame não encontrado
 */
router.patch('/:id/status', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.updateExamStatus);

/**
 * @swagger
 * /api/v1/exams/{id}/result:
 *   patch:
 *     summary: Atualiza o resultado de um exame
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do exame
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               result:
 *                 type: string
 *                 example: "Hemácias: 5.1, Hemoglobina: 15.2, Hematócrito: 45%..."
 *             required:
 *               - result
 *     responses:
 *       200:
 *         description: Resultado atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Exame não encontrado
 */
router.patch('/:id/result', checkRole([UserRole.ADMIN, UserRole.MASTER]), examController.updateExamResult);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   delete:
 *     summary: Cancela um exame (soft delete)
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do exame
 *     responses:
 *       200:
 *         description: Exame cancelado com sucesso
 *       404:
 *         description: Exame não encontrado
 */
router.delete('/:id', checkRole([UserRole.MASTER]), examController.deleteExam);

export default router; 
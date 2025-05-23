import express from "express";
import MedicalController from "../controllers/medicalController";

const router = express.Router();
const medicalController = new MedicalController();

/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   post:
 *     summary: Cria um novo prontuário médico
 *     tags: [Prontuários Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do médico
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - description
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: ID do paciente
 *                 example: "4"
 *               description:
 *                 type: string
 *                 description: Descrição do prontuário médico
 *                 example: "Paciente com dor no peito"
 *     responses:
 *       201:
 *         description: Prontuário médico criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Médico não encontrado
 */
router.post("/:id", medicalController.newMedicalRecord);

/**
 * @swagger
 * /api/v1/medical-records/doctor/{id}:
 *   get:
 *     summary: Obtém todos os prontuários médicos de um médico com paginação
 *     tags: [Prontuários Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do médico
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de registros por página
 *     responses:
 *       200:
 *         description: Lista de prontuários médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       patient_id:
 *                         type: string
 *                       doctor_id:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: ID do médico não informado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/doctor/:id", medicalController.getMedicalRecords);


/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   get:
 *     summary: Obtém um prontuário médico específico pelo ID
 *     tags: [Prontuários Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do prontuário médico
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do prontuário médico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "a1b2c3d4"
 *                 patient_id:
 *                   type: string
 *                   example: "p123"
 *                 doctor_id:
 *                   type: string
 *                   example: "d456"
 *                 description:
 *                   type: string
 *                   example: "Paciente apresenta dor nas costas."
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-21T10:00:00Z"
 *       400:
 *         description: ID do prontuário não informado
 *       404:
 *         description: Prontuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:id', medicalController.getMedicalRecordById);

export default router;

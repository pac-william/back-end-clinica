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
 * /api/v1/medical-records/{id}:
 *   get:
 *     summary: Obtém todos os prontuários médicos de um médico
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
 *     responses:
 *       200:
 *         description: Lista de prontuários médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/:id", medicalController.getMedicalRecords);

export default router;

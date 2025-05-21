import express from "express";
import medicalController from "../controllers/medicalController";

const router = express.Router();

const medicalRecordController = new medicalController();

/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   post:
 *     summary: Cria um novo prontuário médico
 *     tags: [Prontuários Médicos]
 *     security: []
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
 *                 example: "12345"
 *               description:
 *                 type: string
 *                 description: Descrição do prontuário médico
 *                 example: "Paciente com dor no peito"
 *
 *     responses:
 *       201:
 *         description: Prontuário médico criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
router.post("/:id", medicalRecordController.newMedicalRecord);





export default router;
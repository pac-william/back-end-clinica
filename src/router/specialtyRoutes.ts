import express from "express";
import SpecialtyController from "../controllers/specialtyController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const specialtyController = new SpecialtyController();

/**
 * @swagger
 * /api/v1/specialties/create:
 *   post:
 *     summary: Cria uma nova especialidade
 *     tags: [Especialidades]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da especialidade (mínimo 3 caracteres)
 *                 example: "Cardiologia"
 *     responses:
 *       201:
 *         description: Especialidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Cardiologia"
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post("/create", specialtyController.create);

/**
 * @swagger
 * /api/v1/specialties:
 *   get:
 *     summary: Lista todas as especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Cardiologia"
 *       401:
 *         description: Não autorizado
 */
router.get("/", authMiddleware, specialtyController.listAll);

export default router;

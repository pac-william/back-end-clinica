import express from "express";
import SpecialtyController from "../controllers/specialtyController";

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
router.post("/create", specialtyController.createUser);
/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - name
 *         - crm
 *         - specialty
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do médico
 *         name:
 *           type: string
 *           description: Nome do médico
 *         crm:
 *           type: string
 *           description: Registro profissional (CRM)
 *         specialty:
 *           type: string
 *           description: Especialidade do médico
 *         phone:
 *           type: string
 *           description: Telefone do médico
 *         email:
 *           type: string
 *           description: Email do médico
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 */

/**
 * @swagger
 * /api/v1/specialties:
 *   get:
 *     summary: Retorna todas as especialidades
 *     tags: [Especialidades]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar especialidades por nome
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Specialty'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total de registros
 *                     page:
 *                       type: integer
 *                       description: Página atual
 *                     limit:
 *                       type: integer
 *                       description: Itens por página
 *                     totalPages:
 *                       type: integer
 *                       description: Total de páginas
 */
router.get("/", specialtyController.getAll);
/**
 * @swagger
 * /api/v1/specialties/{id}:
 *   get:
 *     summary: Retorna uma especialidade pelo ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da especialidade
 *     responses:
 *       200:
 *         description: Especialidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID is required"
 *       404:
 *         description: Especialidade não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Specialty not found"
 */
router.get("/:id", specialtyController.getById);
/**
 * @swagger
 * /api/v1/specialties/{id}:
 *   put:
 *     summary: Atualiza uma especialidade pelo ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da especialidade
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
 *       200:
 *         description: Especialidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Dados inválidos ou ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name must be at least 3 characters long"
 *       404:
 *         description: Especialidade não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Specialty not found"
 */
router.put("/:id", specialtyController.update);

export default router;

import express from 'express';
import SecretaryController from '../controllers/secretaryController';

const router = express.Router();
const secretaryController = new SecretaryController();

/**
 * @swagger
 * /api/v1/secretaries:
 *   get:
 *     summary: Retorna todas as secretárias
 *     tags: [Secretarias]
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
 *         description: Filtrar secretárias por nome (ignora acentuação e maiúsculas/minúsculas)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar secretárias por email (ignora acentuação e maiúsculas/minúsculas)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filtrar secretárias por telefone
 *     responses:
 *       200:
 *         description: Lista de secretárias
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
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       doctor_id:
 *                         type: integer
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
router.get('/', secretaryController.getAll);
router.post('/', secretaryController.create);

/**
 * @swagger
 * /api/v1/secretaries/{id}:
 *   get:
 *     summary: Busca uma secretária pelo ID
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da secretária
 *     responses:
 *       200:
 *         description: Secretária encontrada
 *       404:
 *         description: Secretária não encontrada
 */
router.get('/:id', secretaryController.getById);

/**
 * @swagger
 * /api/v1/secretaries/{id}:
 *   put:
 *     summary: Atualiza os dados de uma secretária
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da secretária
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Secretária atualizada com sucesso
 *       404:
 *         description: Secretária não encontrada
 */
router.put('/:id', secretaryController.update);

/**
 * @swagger
 * /api/v1/secretaries/{id}:
 *   delete:
 *     summary: Remove uma secretária
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da secretária
 *     responses:
 *       200:
 *         description: Secretária removida com sucesso
 *       404:
 *         description: Secretária não encontrada
 */
router.delete('/:id', secretaryController.delete);

export default router;
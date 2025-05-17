import express from 'express';
import NursesController from '../controllers/secretaryController';

const router = express.Router();
const secretaryController = new NursesController();

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
/* 
router.put('/:id', secretaryController.updatesecretary);
router.delete('/:id', secretaryController.deletesecretary); */

export default router;
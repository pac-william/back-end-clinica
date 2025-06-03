import express from 'express';
import InsuranceController from '../controllers/insuranceController';
import { UserRole } from '../enums/UserRole';
import { checkRole } from '../middleware/auth.middleware';

const router = express.Router();
const insuranceController = new InsuranceController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Insurance:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do convênio
 *         name:
 *           type: string
 *           description: Nome do convênio
 *         description:
 *           type: string
 *           description: Descrição ou observações sobre o convênio
 *         contactPhone:
 *           type: string
 *           description: Telefone de contato do convênio
 */

/**
 * @swagger
 * /api/v1/insurances:
 *   get:
 *     summary: Retorna todos os convênios
 *     tags: [Insurances]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar convênios por nome
 *     responses:
 *       200:
 *         description: Lista de convênios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insurances:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Insurance'
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
router.get('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), insuranceController.getAllInsurances);

/**
 * @swagger
 * /api/v1/insurances/all:
 *   get:
 *     summary: Retorna todos os convênios sem paginação
 *     tags: [Insurances]
 *     description: Útil para selects e dropdowns em interfaces
 *     responses:
 *       200:
 *         description: Lista completa de convênios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insurances:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Insurance'
 */
router.get('/all', checkRole([UserRole.ADMIN, UserRole.MASTER]), insuranceController.getAllInsurancesWithoutPagination);

/**
 * @swagger
 * /api/v1/insurances/{id}:
 *   get:
 *     summary: Retorna um convênio pelo ID
 *     tags: [Insurances]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do convênio
 *     responses:
 *       200:
 *         description: Convênio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: Convênio não encontrado
 */
router.get('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), insuranceController.getInsuranceById);

/**
 * @swagger
 * /api/v1/insurances:
 *   post:
 *     summary: Cria um novo convênio
 *     tags: [Insurances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Unimed"
 *                 description: Nome do convênio
 *               description:
 *                 type: string
 *                 example: "Convênio Unimed Categoria Gold"
 *               contactPhone:
 *                 type: string
 *                 example: "(11) 3333-4444"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Convênio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', checkRole([UserRole.ADMIN, UserRole.MASTER]), insuranceController.createInsurance);

/**
 * @swagger
 * /api/v1/insurances/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um convênio
 *     tags: [Insurances]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do convênio
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Convênio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Convênio não encontrado
 */
router.patch('/:id', checkRole([UserRole.ADMIN, UserRole.MASTER]), insuranceController.updateInsurance);

/**
 * @swagger
 * /api/v1/insurances/{id}:
 *   delete:
 *     summary: Remove um convênio (soft delete)
 *     tags: [Insurances]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do convênio
 *     responses:
 *       200:
 *         description: Convênio removido com sucesso
 *       404:
 *         description: Convênio não encontrado
 */
router.delete('/:id', checkRole([UserRole.MASTER]), insuranceController.deleteInsurance);

export default router; 
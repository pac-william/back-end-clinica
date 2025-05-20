import express from 'express';
import DoctorController from '../controllers/doctorController';

const router = express.Router();
const doctorController = new DoctorController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - name
 *         - crm
 *         - specialties
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
 *         specialties:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da especialidade
 *               name:
 *                 type: string
 *                 description: Nome da especialidade
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
 * /api/v1/doctors:
 *   get:
 *     summary: Retorna todos os médicos
 *     tags: [Doctors]
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
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filtrar médicos por especialidade
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar médicos por nome
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
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
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   get:
 *     summary: Retorna um médico pelo ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do médico
 *     responses:
 *       200:
 *         description: Médico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Médico não encontrado
 */
router.get('/:id', doctorController.getDoctorById);

/**
 * @swagger
 * /api/v1/doctors:
 *   post:
 *     summary: Cria um novo médico
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Carlos Souza
 *               crm:
 *                 type: string
 *                 example: "123456"
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *                 description: IDs das especialidades do médico
 *               phone:
 *                 type: string
 *                 example: "+55 31 98765-4321"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@email.com
 *             required:
 *               - name
 *               - crm
 *               - specialties
 *               - phone
 *               - email
 *     responses:
 *       201:
 *         description: Médico criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctor:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', doctorController.createDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   put:
 *     summary: Atualiza um médico
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       200:
 *         description: Médico atualizado com sucesso
 *       404:
 *         description: Médico não encontrado
 */
router.put('/:id', doctorController.updateDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   delete:
 *     summary: Remove um médico
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do médico
 *     responses:
 *       200:
 *         description: Médico removido com sucesso
 *       404:
 *         description: Médico não encontrado
 */
router.delete('/:id', doctorController.deleteDoctor);

export default router;
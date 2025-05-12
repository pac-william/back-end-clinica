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
 * /api/v1/doctors:
 *   get:
 *     summary: Retorna todos os médicos
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
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
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Médico criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
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
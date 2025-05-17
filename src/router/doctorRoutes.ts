import express from 'express';
import DoctorController from '../controllers/doctorController';
import DoctorService from '../services/doctorService';
import UserService from '../services/userService';

const router = express.Router();
const doctorService = new DoctorService();
const userService = new UserService();
const doctorController = new DoctorController(doctorService,userService);

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
 *     summary: Cria um novo médico e usuário associado
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
 *               specialty:
 *                 type: string
 *                 example: Cardiologia
 *               phone:
 *                 type: string
 *                 example: "+55 31 98765-4321"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@email.com
 *               login:
 *                 type: string
 *                 example: drcarlos
 *               senha:
 *                 type: string
 *                 example: senhaSegura123
 *             required:
 *               - name
 *               - crm
 *               - specialty
 *               - phone
 *               - email
 *               - login
 *               - senha
 *     responses:
 *       201:
 *         description: Médico e usuário criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctor:
 *                   $ref: '#/components/schemas/Doctor'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: drcarlos
 *                     role:
 *                       type: string
 *                       example: DOCTOR
 *                     role_id:
 *                       type: integer
 *                       example: 1
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
import express from 'express';
import PatientController from '../controllers/patientController';

const router = express.Router();
const patientController = new PatientController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do paciente
 *         nome:
 *           type: string
 *           description: Nome do paciente
 *         cpf:
 *           type: string
 *           description: CPF do paciente
 *         telefone:
 *           type: string
 *           description: Telefone do paciente
 *         email:
 *           type: string
 *           description: Email do paciente
 *         data_nascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do paciente
 */

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Retorna todos os pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
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
 *         description: Filtrar pacientes por nome (ignora acentuação e maiúsculas/minúsculas)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar pacientes por email (ignora acentuação e maiúsculas/minúsculas)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filtrar pacientes por telefone
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Paciente'
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
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido
 */
router.get('/', patientController.getAllPatients);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Retorna um paciente pelo ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', patientController.getPatientById);

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Cria um novo paciente e usuário associado
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               phone:
 *                 type: string
 *                 example: "+55 31 99999-9999"
 *               login:
 *                 type: string
 *                 example: joaosilva
 *               senha:
 *                 type: string
 *                 example: senha123
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - login
 *               - senha
 *     responses:
 *       201:
 *         description: Paciente e usuário criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patient:
 *                   $ref: '#/components/schemas/Paciente'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: joaosilva
 *                     role:
 *                       type: string
 *                       example: PATIENT
 *                     role_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', patientController.createPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Atualiza um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *       404:
 *         description: Paciente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', patientController.updatePatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Remove um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente removido com sucesso
 *       404:
 *         description: Paciente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', patientController.deletePatient);

export default router;
import express, { NextFunction, Request, Response } from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Registra um novo usuário comum (role USER)
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/create', (req: Request, res: Response, next: NextFunction) => {
  // Força a role como USER
  req.body.role = 'USER';
  return userController.createUser(req, res, next);
});

/**
 * @swagger
 * /api/v1/users/create-with-privilege:
 *   post:
 *     summary: Cria um novo usuário (requer autenticação para roles ADMIN/MASTER)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *               role:
 *                 type: string
 *                 description: Função do usuário (admin, médico, paciente, etc)
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido
 *       500:
 *         description: Erro no servidor
 */
router.post('/create-with-privilege', authMiddleware, userController.createUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: "usuario@exemplo.com"
 *                         role:
 *                           type: string
 *                           example: "ADMIN"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE5NjI3OTk2LCJleHAiOjE2MTk3MTQzOTZ9.Lgg_Nt0HdGilTBCoRQdP3cW4JYkJWVw5"
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "usuario@exemplo.com"
 *                 role:
 *                   type: string
 *                   example: "ADMIN"
 *       401:
 *         description: Não autorizado
 */
router.get('/profile', authMiddleware, (req, res): void => {
  res.json(req.user);
});

export default router;

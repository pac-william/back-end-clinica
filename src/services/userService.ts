import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { loginDTO, userDTO } from '../dtos/user.dto';
import { UserRepository } from '../repository/userRepository';
import { getUserRoleFromToken } from '../utils/decodeTokenJWT';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

const userRepository = new UserRepository();

// Service responsável pelas operações de negócio relacionadas aos usuários
class UserService {
  /**
   * Lista usuários com filtros e paginação.
   * @param page Número da página
   * @param limit Tamanho da página
   * @param email Email do usuário (opcional)
   * @param role Papel do usuário (opcional)
   * @returns Lista paginada de usuários
   */
  async getAllUsers(page: number = 1, limit: number = 10, email?: string, role?: string) {
    return userRepository.getAllUsers(page, limit, email, role);
  }

  /**
   * Cria um novo usuário.
   * @param email Email do usuário
   * @param password Senha do usuário
   * @param role Papel do usuário (opcional)
   * @param token Token de autenticação (opcional)
   * @returns O usuário criado ou erro de validação
   */
  async createUser({ email, password, role }: z.infer<typeof userDTO>, token?: string): Promise<any> {
    if (!email) {
      return {
        success: false,
        data: {
          email: ['Email é obrigatório'],
        },
      };
    }

    if (!password) {
      return {
        success: false,
        data: {
          password: ['Senha é obrigatória'],
        },
      };
    }

    if (!role) {
      role = 'USER';
    }

    if (role === 'USER') {
      // Continua sem verificar o token
    } else {
      if (!token) {
        throw new Error('Token não fornecido');
      }

      const userRole = getUserRoleFromToken(token);

      if (userRole !== 'ADMIN' && userRole !== 'MASTER') {
        throw new Error('Permissão negada para criar este tipo de usuário');
      }
    }

    const existing = await userRepository.getUserByEmail(email);

    if (existing) {
      return {
        success: false,
        data: {
          email: ['Email already in use'],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await userRepository.createUser({
        email,
        password: hashedPassword,
        role: role,
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário');
    }
  }

  /**
   * Realiza o login de um usuário.
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Token de autenticação ou erro de login
   */
  async login({ email, password }: z.infer<typeof loginDTO>): Promise<any> {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        data: {
          email: ['User not found'],
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        data: {
          password: ['Invalid password'],
        },
      };
    }

    if (!SECRET_KEY) {
      throw new Error('Chave secreta não configurada');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRATION
      }
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token
      },
    };
  }
}

export default UserService;
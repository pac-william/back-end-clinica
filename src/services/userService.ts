import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { loginDTO, userDTO } from '../dtos/user.dto';
import { UserRepository } from '../repository/userRepository';
import { getUserRoleFromToken } from '../utils/decodeTokenJWT';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

const userRepository = new UserRepository();

class UserService {
  async getAllUsers(page: number = 1, limit: number = 10, email?: string, role?: string) {
    return userRepository.getAllUsers(page, limit, email, role);
  }

  async createUser({ email, password, role }: z.infer<typeof userDTO>, token?: string): Promise<any> {
    if (role !== 'USER') {
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

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      role: role,
    });

    return {
      success: true,
      data: user,
    };
  }

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
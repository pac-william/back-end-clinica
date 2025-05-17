import db from '../database/connection';
import bcrypt from 'bcrypt';

type CreateUserInput = {
  login: string;
  senha: string;
  role: 'DOCTOR' | 'SECRETARY' | 'PATIENT';
  role_id: number;
};

class UserService {

    
  async createUser({ login, senha, role, role_id }: CreateUserInput): Promise<any> {
    const existing = await db('users').where('login', login).first();

    if (existing) {
      return {
        success: false,
        dados: {
          login: ['Login já está em uso'],
        },
      };
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [user] = await db('users')
      .insert({
        login,
        senha: senhaCriptografada,
        role,
        role_id,
      })
      .returning(['id', 'login', 'role', 'role_id']);

    return {
      success: true,
      dados: user,
    };
  }
  
}

export default UserService;

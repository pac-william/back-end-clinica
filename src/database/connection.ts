import knex from 'knex';
import config from './knexfile';

// Criando conexão com o banco de dados
const db = knex(config.development);

export default db;
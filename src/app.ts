// Configuração principal da aplicação Express
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/error.middleware';
import healthRouter from './router/healthRouter';
import routes from './router/index';
import swaggerSpec from './swagger';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa a aplicação Express
const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Rotas do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/', routes);
app.use('/', healthRouter);

// Middleware para tratar rotas não encontradas
app.use((_, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});

// Middleware para tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log(`http://localhost:${PORT}`);
});

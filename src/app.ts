// Configuração principal da aplicação Express
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRouter from './router/healthRouter';
import routes from './router/index';
import swaggerSpec from './swagger';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa a aplicação Express
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
app.use('/', routes);
app.use('/', healthRouter);

// Middleware para tratamento de rotas não encontradas
app.use((_, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});

// Inicializa o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log(`http://localhost:${PORT}`);
});

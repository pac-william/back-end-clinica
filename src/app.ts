import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './router/api';
import swaggerSpec from './swagger';

const app = express();
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log(`http://localhost:${PORT}`);
});

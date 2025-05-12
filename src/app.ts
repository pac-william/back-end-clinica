import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './router/index';
import swaggerSpec from './swagger';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log(`http://localhost:${PORT}`);
});

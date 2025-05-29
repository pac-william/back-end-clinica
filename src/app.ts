import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRouter from './router/healthRouter';
import routes from './router/index';
import swaggerSpec from './swagger';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);
app.use('/', healthRouter);

app.use((_, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log(`http://localhost:${PORT}`);
});

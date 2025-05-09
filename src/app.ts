import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';

const app = express();
app.use(express.json());

app.use('/api', pacienteRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

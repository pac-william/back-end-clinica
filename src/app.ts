import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import router from './router/api';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

export default app;
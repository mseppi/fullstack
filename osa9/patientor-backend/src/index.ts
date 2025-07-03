import express from 'express';
import diagnosesRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
    res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);

app.use('/api/patients', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
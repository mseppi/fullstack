import express from 'express';
import { calculateBmi } from './bmicalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    
    if (isNaN(weight) || isNaN(height)) {
        res.send({ error: 'malformatted parameters' }).status(400);
    }

    const bmi = calculateBmi(Number(height), Number(weight));
    res.send({
        weight: Number(weight),
        height: Number(height),
        bmi: bmi
    });
});

app.post('/exercises', (req, res) => {
    interface ExerciseRequestBody {
        daily_exercises: number[];
        target: number;
    }
    const body = req.body as ExerciseRequestBody;
    const dailyExercises: number[] = body.daily_exercises;
    const target: number = body.target;
    
    if (!dailyExercises || !target) {
        res.status(400).send({ error: 'parameters missing' });
    }

    if (isNaN(target) || dailyExercises.some(isNaN)) {
        res.status(400).send({ error: 'malformatted parameters' });
    }

    const result = calculateExercises(target, dailyExercises);
    res.send({result}).status(200);
});

    
    

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


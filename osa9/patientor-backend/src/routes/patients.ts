import express from 'express';
import { NewPatientSchema } from '../utils';
import patientService from '../services/patientService';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getNoSsnPatients());
});

router.get('/:id', (req, res) => {
    const patient = patientService.findPatientById(req.params.id);

    if (patient) {
        res.send(patient);
    } else {
        res.status(404).send({ error: 'Patient not found' });
    }
});

router.post('/', (req, res) => {
    try {
        const newPatient = NewPatientSchema.parse(req.body);
        const addedPatient = patientService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).send({ error: error.issues });
        } else {
            res.status(400).send({ error: 'Something went wrong' });
        }
    }
});

export default router;
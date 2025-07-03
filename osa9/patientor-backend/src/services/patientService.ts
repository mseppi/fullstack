import patientData from '../../data/patients';
import { Patient, NoSsnPatient, NewPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patientData;
};

const getNoSsnPatients = (): NoSsnPatient[] => {
    return patientData.map(({ ssn: _ssn, ...rest }) => rest);
};

const findPatientById = (id: string): Patient | undefined => {
    return patientData.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
    const id = uuid();
    const newPatient = {
        ...patient,
        id,
    };

    patientData.push(newPatient);
    return newPatient;
};

export default {
  getPatients,
  getNoSsnPatients,
  findPatientById,
  addPatient,
};
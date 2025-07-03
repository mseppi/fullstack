import { NewPatient, Gender } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dateOfBirth: z.string().date().optional(),
    ssn: z.string().optional(),
    gender: z.nativeEnum(Gender),
    occupation: z.string().min(1, "Occupation is required"),
});

export const toNewPatientSchema = (object: unknown): NewPatient => {
    return NewPatientSchema.parse(object);
};
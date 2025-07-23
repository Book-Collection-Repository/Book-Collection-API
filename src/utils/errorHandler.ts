//Importações
import { ZodError } from "zod";
import { Response } from "express";

export const handleZodError = (error: ZodError, res: Response) => {
    const validationErrors = error.errors.map(err => ({
        path: err.path,
        message: err.message,
    }));
    return res.status(400).json({ errors: validationErrors });
};

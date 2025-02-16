import { TypeComplaint } from "@prisma/client";

//Definindo um interface padrão
export interface Complaint {
    id: string;
    userId: string;
    type: TypeComplaint;
    text: string;
    description: string;
    createdAt: Date;
};

//Criação de um novo tipo de dados
export type ComplaintDTO = Omit<Complaint, "id"| "createdAt">;
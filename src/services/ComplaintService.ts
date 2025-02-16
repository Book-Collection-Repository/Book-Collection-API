//Importações
import { prisma } from "./prisma";

//Types
import { ComplaintDTO } from "../types/ComplaintsTypes";

//Class
export class ComplaintService {
    //Criando uma denúncia
    async createComplaint(data: ComplaintDTO) {
        try {
            return await prisma.complaint.create({ data: {...data}});

        } catch (error) {
            console.error("Error in created Complaint: ", error);
            return {success: false, message: "Error in created complaint"};
        }
    };

    //Listando denúncias de um usuário
    async listComplaintsOfUser(userId: string) {
        return await prisma.complaint.findMany({where: { userId }});
    };
};
//Importações
import { Request, Response } from "express";

//Services
import { PublicationService } from "../services/PublicationService";

//Validator
import { createPublicationSchema } from "../validators/publicationValidator";

//Class
export class PublicationController {
    private publicationService: PublicationService;

    constructor() {
        this.publicationService = new PublicationService();
    };

    //Requisição para listar todas as publicações realizada recentemente
    async getFindAllLatestPublications(req: Request, res: Response): Promise<Response> {
        try {
            //Chama o método
            const data = await this.publicationService.findAllLatestPublication();
            if (!data.length) return res.status(404).json({ message: "Publications not found" });

            //Retornando os dados
            return res.status(200).json({ message: "Return publications successfull", data });
        } catch (error) {
            console.error("Error return publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    }

    //Requisição para listar todas as publicações de um usuário
    async getFindAllPublicationsOfUser(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário

            //Realizando a busca de dados
            const data = await this.publicationService.findAllPublcationsOfUser(idUser);
            if (!data.length) return res.status(400).json({ message: "User not publications" });

            //Retornando os dados
            return res.status(200).json({ message: "Return messages of user", data });

        } catch (error) {
            console.error("Error return publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para listar dados de um publicação
    async getFindDataPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idPublication = req.params.idPublication; //Pegando o id da publicação

            //Buscando dados
            const data = await this.publicationService.findDataPublication(idPublication);
            if (!data) return res.status(404).json({ message: "Publication not found" });

            //Retornando dados
            return res.status(200).json({ message: "Return data of publication", data });

        } catch (error) {
            console.error("Error return publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para criar um publicação
    async createPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const data = createPublicationSchema.parse(req.body); //Pegando o conteúdo da mensagem

            //Enviando os dados
            const createData = await this.publicationService.createPublication(idUser, data.content);
            if (!createData.success) return res.status(404).json({message: createData.message});

            //Retornando os dados
            return res.status(201).json({message: createData.message, data: createData.data});

        } catch (error) {
            console.error("Error create publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para atualizar uma requisição
    async updatePublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o dado do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação
            const data = createPublicationSchema.parse(req.body); //Pegando o conteúdo da mensagem

            //Enviando os dados
            const updateData = await this.publicationService.updatePublication(idPublication, idUser, data.content);
            if (!updateData.success) return res.status(400).json({message: updateData.message});

            //Retornando os dados
            return res.status(200).json({message: updateData.message, data: updateData.data});

        } catch (error) {
            console.error("Error update publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para remover uma requisição
    async removePublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o dado do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação

            //Enviando os dados
            const removeData = await this.publicationService.removePublication(idPublication, idUser);
            if (!removeData.success) return res.status(400).json({message: removeData.message});

            //Retornando os dados
            return res.status(200).json({message: removeData.message});

        } catch (error) {
            console.error("Error remove publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };
};
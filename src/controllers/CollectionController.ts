//Importações
import { Request, Response } from "express";

//Types
import { CustomCollectionDTO } from "../types/collectionTypes";

//Services
import { CollectionService } from "../services/CollectionService";

//Validators
import { createCustomCollectionSchema } from "../validators/collectionsValidator";
import { ZodError } from "zod";
import { handleZodError } from "../utils/errorHandler";

//Class
export class CollectionController {
    private collectionService: CollectionService;

    constructor() {
        this.collectionService = new CollectionService();
    } 

    //Método para listar os dados das coleções de usuários
    async getListCollectionsOfUser(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando id do usuário
            const idUser = req.id_User;

            //Procurando collection
            const collection = await this.collectionService.listCollectionsOfUser(idUser);

            return res.status(200).json({ collection});
        } catch (error) {
            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar os dados de um coleção
    async getListDataFromCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando id da coleção
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;

            //Procurando collection
            const collection = await this.collectionService.listDataFromCollection(idCollection, idUser);
            if (!collection.success || collection.data === null) return res.status(collection.status).json({ message: collection.message });

            return res.status(collection.status).json({ message: collection.message, collection: collection.data });
        } catch (error) {
            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para criar as coleções padrões
    async createDefaultCollections(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;

            //Criando coleções padrões para o usuário
            const defaultCollection = await this.collectionService.createDefaultCollections(idUser);
            if (!defaultCollection.success) return res.status(defaultCollection.status).json({ message: defaultCollection.message });

            //Retornando dados
            return res.status(defaultCollection.status).json({ message: defaultCollection.message });
        } catch (error) {
            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para criar as coleções personalizadas
    async creteCustomCollections(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const collection: CustomCollectionDTO = createCustomCollectionSchema.parse(req.body);

            //Criando coleção
            const createCollection = await this.collectionService.createCustomCollection(collection, idUser);
            if (!createCollection.success) return res.status(createCollection.status).json({ message: createCollection })

            //Retornando resposta
            return res.status(createCollection.status).json({ message: createCollection.message, collection: createCollection.data })

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para editar uma coleção personalizada
    async updateCustomCollections(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;
            const collection: CustomCollectionDTO = createCustomCollectionSchema.parse(req.body);

            //Editando coleção
            const updatedCollection = await this.collectionService.updateCustomCollection(idCollection, idUser, collection);
            if (!updatedCollection.success) return res.status(updatedCollection.status).json({message: updatedCollection.message});

            //Retornando os dados
            return res.status(updatedCollection.status).json({message: updatedCollection.message, data: updatedCollection.data});
        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para remover uma coleção personalizada
    async deleteCutomCollection(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;

            //Removendo coleção
            const removedCollection = await this.collectionService.removeCustomCollection(idCollection, idUser);
            if (!removedCollection.success) return res.status(removedCollection.status).json({message: removedCollection.message});

            //Retornando os dados
            return res.status(removedCollection.status).json({message: removedCollection.message});
        } catch (error) {
            console.error("Error return collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};
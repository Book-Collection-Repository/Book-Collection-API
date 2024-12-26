//Importações
import { prisma } from "./prisma";

//Types
import { Collection, CreateDefaultCollectionDTO, CustomCollectionDTO } from "../types/collectionTypes";
import { DefaultType, CollectionStatus } from "@prisma/client";

//Service
import { UserService } from "./UserService";

//Class
export class CollectionService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    //Método para listar as coleções de um usuário
    async listCollectionsOfUser(userId: string) {
        const data = await prisma.collection.findMany({
            where: { userId },
            include: { books: {
                take: 5,
                include: {
                    book: true,
                }
            } }
        });

        return data;
    };

    //Método para saber se um coleção existe
    async getFindExistsCollection(id: string) {
        const data = await prisma.collection.findUnique({
            where: {id},
        });

        return data;
    };

    // Método para listar dados de uma coleção
    async listDataFromCollection(id: string, userId: string) {
        //Busacando dados
        const data = await prisma.collection.findUnique({
            where: { id }, 
            include: {
                books: {
                    include: {
                        book: true
                    }
                }
            }
        });
        if (!data) return { success: false, status: 404, message: "Collection with ID not found", data: null };

        // Verifica se a coleção é privada e se o usuário requisitante é o proprietário
        if (data.visibility === 'PRIVATE' && data.userId !== userId) return { success: false, status: 403, message: "Access denied to this collection", data: null };
   
        return { success: true, status: 200, message: "Collection exist", data: data };
    };

    // Método para criar coleções padrão para um novo usuário
    async createDefaultCollections(userId: string): Promise<{ success: boolean; status: number; message: string }> {
        try {
            //Validando que as coleções padrãos já não foram criadas
            const defaultCollectionIsExiting = await this.defaultCollectionIsExisting(userId);
            if (!defaultCollectionIsExiting.success) return { success: false, status: 400, message: defaultCollectionIsExiting.message };

            //Criando objeto para criar as coleções padrões
            const defaultCollectionsData: CreateDefaultCollectionDTO[] = Object.values(DefaultType).map((defaultType) => ({
                collectionStatus: CollectionStatus.DEFAULT,
                defaultType,
                title: this.getTitleForDefaultType(defaultType), // Função auxiliar para definir título
                visibility: "PUBLIC",
                description: this.getDescriptionForDefaultType(defaultType),
                userId,
            }));

            //Criando as coleções
            await prisma.collection.createMany({ data: defaultCollectionsData });

            //Retornando
            return { success: true, status: 201, message: "Default collections created successfully" };
        } catch (error) {
            console.error("Error creating collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    // Método para criar uma coleção personalizada
    async createCustomCollection(collection: CustomCollectionDTO, userId: string) {
        try {
            const customCollection = await prisma.collection.create({
                data: {
                    ...collection,
                    userId,
                    collectionStatus: CollectionStatus.CUSTOM,
                    defaultType: null, // Definido como nulo para coleções customizadas
                },
                include: {
                    books: true
                }
            });

            return { success: true, status: 201, message: "Custom collection created successfully", data: customCollection };
        } catch (error) {
            console.error("Error creating collection: ", error);
            return { success: false, status: 400, message: "There was a problem, custom collection not created" };
        }
    };

    // Método para editar uma coleção personalizada
    async updateCustomCollection(id: string, userId: string, collection: CustomCollectionDTO) {
        try {
            // Valida se o usuário é o responsável por essa coleção
            const isUserResponsible = await this.getUserResponsibleForCollection(id, userId);
            if (!isUserResponsible) return { success: false, status: 400, message: "User specified is not responsible for the collection" };

            // Valida se a coleção é personalizada (coleção padrão não pode ser editada)
            const collectionStatus = await this.getWhatStatusOfCollection(id);
            if (collectionStatus === "DEFAULT") return { success: false, status: 400, message: "Default collections cannot be edited" };

            // Atualiza a coleção personalizada
            const updatedCollection = await prisma.collection.update({
                where: { id },
                data: { ...collection },
                include: {books: true}
            });

            return { success: true, status: 200, message: "Collection updated successfully", data: updatedCollection };
        } catch (error) {
            console.error("Error creating collection: ", error);
            return { success: false, status: 400, message: "There was a problem, custom collection not created" };
        }
    };

    // Método para remover um coleção
    async removeCustomCollection(id: string, userId: string) {
        try {
            // Valida se o usuário é o responsável por essa coleção
            const isUserResponsible = await this.getUserResponsibleForCollection(id, userId);
            if (!isUserResponsible) return { success: false, status: 400, message: "User specified is not responsible for the collection" };

            // Valida se a coleção é personalizada (coleção padrão não pode ser removida)
            const collectionStatus = await this.getWhatStatusOfCollection(id);
            if (collectionStatus === "DEFAULT") return { success: false, status: 400, message: "Default collections cannot be edited" };

            await prisma.collection.delete({
                where: { id }
            });

            return { success: true, status: 200, message: "Collection removed successfully" }
        } catch (error) {
            console.error("Error creating collection: ", error);
            return { success: false, status: 400, message: "There was a problem, custom collection not created" };
        }
    };

    // Função para identificar se o usuário é o dono da coleção
    async getUserResponsibleForCollection(collectionId: string, userId: string): Promise<boolean> {
        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
            select: { userId: true },
        });

        // Se a coleção não for encontrada, ou se o userId não coincidir, retorna false
        return !!(collection && collection.userId === userId);
    }

    // Função para identificar se a coleção é padrão ou personalizada
    private async getWhatStatusOfCollection(collectionId: string): Promise<CollectionStatus | null> {
        const data = await prisma.collection.findUnique({
            where: { id: collectionId },
            select: { collectionStatus: true },
        });

        return data ? data.collectionStatus : null;
    }

    // Função auxiliar para definir título das coleções padrão
    private getTitleForDefaultType(defaultType: DefaultType): string {
        switch (defaultType) {
            case DefaultType.REVIEWED:
                return "Livros avaliados";
            case DefaultType.READING:
                return "Leituras atuais";
            case DefaultType.WANT_TO_READ:
                return "Deseja ler";
            case DefaultType.READ:
                return "Livros lidos";
            default:
                return "Coleção Padrão";
        };
    };

    // Função auxiliar para definir descrição das coleções padrão
    private getDescriptionForDefaultType(defaultType: DefaultType): string {
        switch (defaultType) {
            case DefaultType.REVIEWED:
                return "Coleção destinada para livros avaliados por um usuário. Coleção padrão, não pode ser manipulada ou removida.";
            case DefaultType.READING:
                return "Coleção detinada para leituras atuais. Coleção padrão, não pode ser manipulada ou removida.";
            case DefaultType.WANT_TO_READ:
                return "Coleção destinadas para livros que o usuário deseja ler. Coleção padrão, não pode ser manipulada ou removida.";
            case DefaultType.READ:
                return "Coleção detinanda para livros lidos. Coleção padrão, não pode ser manipulada ou removida.";
            default:
                return "Coleção Padrão. Coleção padrão, não pode ser manipulada ou removida.";
        };
    };

    // Função privada para visualizar uma coleção
    private async collectionIsVisible(id: string) {
        const collection = await prisma.collection.findUnique({
            where: { id },
            select: { visibility: true },
        });

        if (!collection?.visibility) return { success: false, message: "Collection not found or collection not visible" };

        return { success: true, message: "Collection is visible" };
    };

    // Função para verificar se as coleçãos padrões já foram criadas
    private async defaultCollectionIsExisting(userId: string) {
        const existingCollections = await prisma.collection.findMany({
            where: {
                userId,
                collectionStatus: CollectionStatus.DEFAULT,
                defaultType: { in: Object.values(DefaultType) }, // Verifica para todos os tipos de coleção padrão
            },
        });

        // Se já existirem coleções padrão, retorna uma mensagem informando que não é necessário criá-las novamente
        if (existingCollections.length > 0) return { success: false, message: "Default collections already exist for this user" };

        return { success: true, message: "Default collections are not existing" };
    };
}
//Importações
import { DefaultType, CollectionStatus, EntityVisibility } from "@prisma/client";

//Definindo um tipo do dado
export interface Collection {
    id: string;
    collectionStatus: CollectionStatus;
    defaultType: DefaultType;
    description?: string;
    title: string;
    visibility: EntityVisibility;
    createdAt: Date;
    userId: string;
};

//Definindo tipo de dado usados nas requisições
export type CreateDefaultCollectionDTO = Omit<Collection, 'id' | 'createdAt' >

//Definindo tipo para a edição de uma coleção
export type CustomCollectionDTO = Omit<Collection, 'id' | 'createdAt' | 'userId' | 'defaultType' | 'collectionStatus'>

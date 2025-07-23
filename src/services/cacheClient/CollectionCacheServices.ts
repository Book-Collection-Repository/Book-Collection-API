//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class CollectionCacheServices {
    //Definindo variáveis
    private readonly urlDataAllCollection: string = "collectionUser:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }

    /** ================= METHODS OF ALL COLLECTIONS ===================*/
    //Listando as coleções
    async getListAllCollections(userId: string) : Promise<any | void> {
        const key = `${this.urlDataAllCollection}${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando as coleções
    async saveAllCollections(userId: string, data:any): Promise<void> {
        const key = `${this.urlDataAllCollection}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };
    
    /** ================= METHODS OF A COLLECTION ===================*/
    //Listando dado de um diário de leitura
    async getListCollection(userId: string, collectionId: string) : Promise<any | void> {
        const key = `${this.urlDataAllCollection}${collectionId}-user:${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando dados de um diário de leitura
    async saveCollection(userId: string, collectionId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataAllCollection}${collectionId}-user:${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };
}
//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class PublicationCacheServices {
    //Definindo variáveis
    private readonly urlDataAllpublications: string = "publicationsUser:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }

    /** ================= METHODS OF ALL publicationS ===================*/
    //Listando as coleções
    async getListAllpublications(userId: string) : Promise<any | void> {
        const key = `${this.urlDataAllpublications}${userId}`;
        console.log("Retornando publicações");
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando as coleções
    async saveAllPublications(userId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataAllpublications}${userId}`;
        console.log("Salvando publicações");
        this.methodsUtils.saveCachedData(key, data);
    };
};
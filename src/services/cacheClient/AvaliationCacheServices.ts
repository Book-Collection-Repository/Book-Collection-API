//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class AvaliationCacheServices {
    //Definindo variáveis
    private readonly urlDataAllAvaliations: string = "avaliationsUser:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }

    /** ================= METHODS OF ALL AVALIATIONS ===================*/
    //Listando as avaliações
    async getListAllAvaliations(userId: string) : Promise<any | void> {
        const key = `${this.urlDataAllAvaliations}${userId}`;
        console.log("Retornando dados do cache");
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando as avaliações
    async saveAllAvaliations(userId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataAllAvaliations}${userId}`;
        console.log("Salvando dados no cache");
        this.methodsUtils.saveCachedData(key, data);
    };
};
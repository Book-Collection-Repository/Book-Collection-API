//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class UserCacheServices {
    private readonly urlDataUser: string = "dataUser:";
    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }
    
    // ================= METHODS OF A USER ===================*/
    // Listando dado de um diário de leitura
    async getListUser(userId: string): Promise<any | void> {
        const key = `${this.urlDataUser}${userId}`;
        console.log("Retornando dados do cache de user");
        return this.methodsUtils.getCachedData(key);
    }
    // Salvando dados de um diário de leitura
    saveUser(userId: string, data: any): Promise<void> {
        const key = `${this.urlDataUser}${userId}`;
        console.log("Salvando dados no cache de user");
        return this.methodsUtils.saveCachedData(key, data);
    }
}
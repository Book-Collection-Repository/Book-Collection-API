//Importaões
import { redis } from "../../connection/redisClient";
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class FollwersCacheServices {
    //Definindo variáveis
    private readonly urlDataFollowers: string = "allFollowers:";
    private readonly urlDataFolloweds: string = "allFolloweds:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }

    /** ================= METHODS OF FOLLOWERS ===================*/
    //Listando os seguidores
    async getListAllFollowers(userId: string): Promise<any | null> {
        const key = `${this.urlDataFollowers}${userId}`;
        return this.methodsUtils.getCachedData(key); 
    };

    //Salvando os seguyidores
    async saveFollowers(userId: string, data: any | any[]): Promise<void> {
        const key = `${this.urlDataFollowers}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };

    /** ================= METHODS OF FOLLOWEDS ===================*/
    //Listando os seguindo
    async getListAllFolloweds(userId: string) : Promise<any | void> {
        const key = `${this.urlDataFolloweds}${userId}`;
        return this.methodsUtils.getCachedData(key); 
    };  

    //Salvando os seguindo
    async saveFolloweds(userId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataFolloweds}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };
};
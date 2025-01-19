//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class ReadingDiariesCacheServices {
    //Definindo variáveis
    private readonly urlDataAllDiaries: string = "readingDiariesUser:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }

    /** ================= METHODS OF ALL READING DIARIES ===================*/
    //Listando os diários de leitura
    async getListAllReadingDiaries(userId: string) : Promise<any | void> {
        const key = `${this.urlDataAllDiaries}${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando os diárioes de leitura
    async saveAllReadingDiaries(userId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataAllDiaries}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };
    
    /** ================= METHODS OF A READING DIARIES ===================*/
    //Listando dado de um diário de leitura
    async getListReadingDiaries(userId: string, readingId: string) : Promise<any | void> {
        const key = `${this.urlDataAllDiaries}${readingId}-user:${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando dados de um diário de leitura
    async saveReadingDiaries(userId: string, readingId: string, data:any): Promise<void> {
        const key = `${this.urlDataAllDiaries}${readingId}-user:${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };
}
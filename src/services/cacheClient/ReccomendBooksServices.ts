//Importações
import { MethodsUtilsCached } from "./MethodsUtilsCached";

//Definindo class
export class ReccomendCacheServices {
    //Definindo variáveis
    private readonly userSufix: string = "user:";
    private readonly urlDataAllReccomendations: string = "recommendedBooks:";
    private readonly urlDataReccomendationsForCollection: string = "recommendCollection:";
    private readonly urlDataPrefferencesForCollection: string = "preferrencesCollection:";
    private readonly urlDataSearchBooks: string = "searchBooks:";

    private methodsUtils: MethodsUtilsCached;

    constructor () {
        this.methodsUtils = new MethodsUtilsCached();
    }
    
    /** ================= METHODS OF ALL RECCOMENDATIONS ===================*/
    //Listando os livros recomendados
    async getListAllReccomendations(userId: string) : Promise<any | void> {
        const key = `${this.urlDataAllReccomendations}${userId}`;
        return this.methodsUtils.getCachedData(key);

    };  

    //Salvando os livros recomendados
    async saveAllReccomendations(userId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataAllReccomendations}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };

    /** ================= METHODS OF RECCOMENDATIONS FOR COLLECTION ===================*/
    //Listando as recomendações por coleção
    async getListReccomendationsForCollection(userId: string, collectionId: string) : Promise<any | void> {
        const key = `${this.urlDataReccomendationsForCollection}${collectionId}-${this.userSufix}${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando as recomendaões por coleção
    async saveReccomendationsForCollection(userId: string, collectionId: string, data:any | any[]): Promise<void> {
        const key = `${this.urlDataReccomendationsForCollection}${collectionId}-${this.userSufix}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };

    /** ================= METHODS OF PREFERENCES FOR COLLECTION ===================*/
    //Listando as preferências por coleção
    async getListPrefferencesForCollection(userId: string, collectionId: string) : Promise<any | void> {
        const key = `${this.urlDataPrefferencesForCollection}${collectionId}-${this.userSufix}${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando as prefereências por coleção
    async savePrefferencesForCollection(userId: string, collectionId: string, data:any | any []): Promise<void> {
        const key = `${this.urlDataPrefferencesForCollection}${collectionId}-${this.userSufix}${userId}`;
        this.methodsUtils.saveCachedData(key, data);
    };

    /** ================= METHODS OF SEARCH BOOKS ===================*/
    //Listando os livrios pesquisados pelo usuário
    async getListSearchBooks(userId: string) : Promise<any | void> {
        const key = `${this.urlDataSearchBooks}${userId}`;
        return this.methodsUtils.getCachedData(key);    
    };  

    //Salvando os livrios pesquisados pelo usuário
    async saveSearchBooks(userId: string, data:any[]): Promise<void> {
        const key = `${this.urlDataSearchBooks}${userId}`;
        console.log("Data: ", data);
        this.methodsUtils.saveCachedData(key, data);
    };
};
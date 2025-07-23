//Importações
import { redis } from "../connection/redisClient";

//Class
export class RedisClientService {

    //Atributos privados, serão usados para gerir os caminhos do sistema
    private readonly urlDataUser: string = "user:";
    private readonly urlDataBook: string = "book:";
    private readonly urlCollectionPreferences: string = "collection";
    private readonly urlReadingDiaryPercentage: string = "diary:";
    private readonly expirationTime: number = 172800; // Dois dias em segundos

    //Método para salvar dados de busca de um usuário
    async saveUserData(user: string, data: any): Promise<void> {
        const key = `${this.urlDataUser}${user}`;
        await redis.set(key, JSON.stringify(data), 'EX', this.expirationTime); // Definindo o tempo de expiração
    };

    //Método para recuperar dados de de busca de um usuário
    async getUserData(user: string): Promise<any | null> {
        const key = `${this.urlDataUser}${user}`;
        const cachedData = await redis.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    };

    //Método para salvar as pequisas recentes de livros de um usuário

    //Método para recuperar as pesquisa recentes de livros de um usuário

    // Método para salvar os gêneros preferidos dos usuários por coleção
    async saveUserPreferredGenresForCollections(user: string, collection: string, genres: string[]): Promise<void> {
        const key = `${this.urlCollectionPreferences}-${user}-${collection}:genres`;
        await redis.set(key, JSON.stringify(genres));
        console.log("Salvando dados de gêneros na coleção: ", JSON.stringify(genres));
    };

    // Método para recuperar os gêneros preferidos dos usuários por coleção
    async getUserPreferredGenresForCollections(user: string, collection: string): Promise<string[] | null> {
        const key = `${this.urlCollectionPreferences}-${user}-${collection}:genres`;
        const cachedGenres = await redis.get(key);
        return cachedGenres ? JSON.parse(cachedGenres) : null;
    };

    // Método para salvar os autores preferidos dos usuários por coleção
    async saveUserPreferredAuthorsForCollection(user: string, collection:string, authors: string[]): Promise<void> {
        const key = `${this.urlCollectionPreferences}-${user}-${collection}:authors`;
        await redis.set(key, JSON.stringify(authors));
        console.log("Salvando dados de autores na coleção: ", JSON.stringify(authors));
    };

    // Método para recuperar os autores preferidos dos usuários por coleção
    async getUserPreferredAuthorsForCollections(user: string, collection: string): Promise<string[] | null> {
        const key = `${this.urlCollectionPreferences}-${user}-${collection}:authors`;
        const cachedAuthors = await redis.get(key);
        return cachedAuthors ? JSON.parse(cachedAuthors) : null;
    };

    // Método para salvar os gêneros gerais preferidos pelo autor
    async saveUserPreferredAllGenres(user: string, genres: string[]|null): Promise<void> {
        const key = `${this.urlCollectionPreferences}-${user}:genres`;
        await redis.set(key, JSON.stringify(genres));
        console.log("Salvando dados de gêneros em todas as coleções: ", JSON.stringify(genres));
    };

    // Método para recuperar os gêneros gerais preferidos pelo autor
    async getUserPreferredAllGenres(user: string): Promise<string[] | null> {
        const key = `${this.urlCollectionPreferences}-${user}:genres`;
        const cachedGenres = await redis.get(key);
        return cachedGenres ? JSON.parse(cachedGenres) : null;
    };

    // Método para salvar a porcentagem de leitura anterior de um diário de leitura
    async savePreviousReadingPercentage(diaryId: string, previousPercentage: number): Promise<void> {
        const key = `${this.urlReadingDiaryPercentage}${diaryId}:percentage`;
        await redis.set(key, previousPercentage);
    };

    // Método para recuperar a porcentagem de leitura anterior de um diário de leitura
    async getPreviousReadingPercentage(diaryId: string): Promise<number | null> {
        const key = `${this.urlReadingDiaryPercentage}${diaryId}:percentage`;
        const previousPercentage = await redis.get(key);
        return previousPercentage ? parseFloat(previousPercentage) : null;
    };
};
//Importações
import { redis } from "../connection/redisClient";

//Class
export class RedisClientService {
    
    //Atributos privados, serão usados para gerir os caminhos do sistema
    private readonly urlDataUser: string = "user:"
    private readonly urlDataBook: string = "book:"
    private readonly urlCollectionPreferences: string = "collection:"
    private readonly urlReadingDiaryPercentage: string = "diary:"

    //Método para salvar dados de busca de um usuário

    //Método para recuperar dados de de busca de um usuário

    //Método para salvar as pequisas recentes de livros de um usuário

    //Método para recuperar as pesquisa recentes de livros de um usuário

    //Método para salvar os gêneros preferidos dos usuários

    //Método para salvar os autores preferisos dos usuários

    //Método para recuperar os gêneros preferidos dos usuários

    //Método para recuperar os autores preferisos dos usuários

    // Método para salvar a porcentagem de leitura anterior de um diário de leitura
    async savePreviousReadingPercentage(diaryId: string, previousPercentage: number): Promise<void> {
        const key = `${this.urlReadingDiaryPercentage}${diaryId}:percentage`;
        await redis.set(key, previousPercentage);
        console.log("Salvando porcentagem antiga: " + previousPercentage);
    };

    // Método para recuperar a porcentagem de leitura anterior de um diário de leitura
    async getPreviousReadingPercentage(diaryId: string): Promise<number | null> {
        const key = `${this.urlReadingDiaryPercentage}${diaryId}:percentage`;
        const previousPercentage = await redis.get(key);
        return previousPercentage ? parseFloat(previousPercentage) : null;
    };
};
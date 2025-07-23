//Importações
import { redis } from "../../connection/redisClient";

//Definindo classe
export class MethodsUtilsCached {
    private readonly expirationTime: number = 172800; // Dois dias em segundos

    /**
   * Método utilitário para gerar chaves
   */
    generateKey(baseKey: string, userId: string): string {
        return `${baseKey}${userId}`;
    }

    /**
     * Método utilitário para buscar dados do Redis
     */
    async getCachedData(key: string): Promise<any | null> {
        const cachedData = await redis.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    /**
     * Método utilitário para salvar dados no Redis
     */
    async saveCachedData(key: string, data: any | any[]): Promise<void> {
        await redis.set(key, JSON.stringify(data), "EX", this.expirationTime);
    }

    /**
     * Método utilitário para remover dados no Redis
     */
    async removeCacheData(key:string): Promise<void> {
        await redis.del(key);
    }
};
//Importações
import { prisma } from "./prisma";

//Types
import { DefaultType } from "@prisma/client";

//Services
import { BookService } from "./BookService";
import { CollectionService } from "./CollectionService";
import { RedisClientService } from "./RedisClientService";

//Class
export class BookCollectionService {

    private collectionService: CollectionService;
    private bookService: BookService;
    private redisClientService: RedisClientService;

    constructor() {
        this.collectionService = new CollectionService();
        this.bookService = new BookService();
        this.redisClientService = new RedisClientService();
    };

    //Listar livros de uma coleção
    async listBookOfCollection(collectionId: string) {
        const booksCollection = await prisma.bookCollection.findMany({
            where: { collectionId },
        });

        return booksCollection;
    };

    //Método para adicionar um livro na coleção personalizada
    async addtingBookInCollection(collectionId: string, bookId: string, userId: string) {
        try {
            //Validando que o usuário é o responsável pela a coleção
            const userIsResponsibleForCollection = await this.collectionService.getUserResponsibleForCollection(collectionId, userId);
            if (!userIsResponsibleForCollection) return { success: false, status: 400, message: "User not found OR user not responsible for collection" };

            //Verifica que o livro existe
            const checkingBookExists = await this.bookService.getBookInDataBaseWithID(bookId);
            if (!checkingBookExists) return { success: false, status: 400, message: "The book not found" };

            //Verificando se o livro já está presente na coleção
            const verifyBookInCollection = await this.CheckingIfBookIsStoredTheCollection(collectionId, bookId);
            if (verifyBookInCollection) return { success: false, status: 400, message: "The book is already in this collection" };

            //Adicionando livro na coleção
            const addtingBook = await prisma.bookCollection.create({
                data: { collectionId, bookId, },
            });

            //Verificando os gêneros e autores que mais esse repetem
            await this.mainGenresAndAuthorsInCollection(collectionId, userId);
            await this.mainGenresInShelfCollection(userId);

            //Retornando o dado
            return { success: true, status: 201, message: "Book is additing in collection", data: addtingBook };

        } catch (error) {
            console.error("Error addting book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    //Método para adicionar um livro na coleções padrão
    async addtingBookInDefaultCollection(bookId: string, userId: string, type: DefaultType) {
        try {
            // Procuarando e verificando se a coleção existe
            const collection = await prisma.collection.findUnique({
                where: { defaultType_userId: { defaultType: type, userId } }
            });
            if (!collection) return { success: false, status: 400, message: "Collection not found" };

            //Chama o método de de adiciona um livro
            const addtingBook = await this.addtingBookInCollection(collection.id, bookId, userId);

            //Retorna a resposta do método
            return { success: addtingBook.success, status: addtingBook.status, message: addtingBook.message, data: addtingBook.data };
        } catch (error) {
            console.error("Error addting book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    //Método para remover um livro da coleção
    async removingBookInCollection(collectionId: string, bookId: string) {
        try {
            //Verificando se o livro já está presente na coleção
            const verifyBookInCollection = await this.CheckingIfBookIsStoredTheCollection(collectionId, bookId);
            if (!verifyBookInCollection) return { success: false, status: 400, message: "The book is not already in this collection" };

            //Removendo livro da coleção
            await prisma.bookCollection.delete({
                where: {
                    bookId_collectionId: {
                        bookId, collectionId
                    }
                },
            });

            //Retornando resposta
            return { success: true, status: 200, message: "Book is removing in the collection" };

        } catch (error) {
            console.error("Error removing book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    //Função para identificar se o livro já faz parte da coleção
    private async CheckingIfBookIsStoredTheCollection(collectionId: string, bookId: string) {
        const data = await prisma.bookCollection.findUnique({
            where: {
                bookId_collectionId: {
                    bookId,
                    collectionId
                },
            },
        });

        return data;
    };

    //Função para identificar os gêneros mais presentes numa dada coleção
    private async mainGenresAndAuthorsInCollection(collectionId: string, userId: string) {
        // Obtém os livros da coleção
        const books = await this.listBookOfCollection(collectionId);
        if (books.length === 0) return { success: false, message: "Collection does not have books" };

        // Extrai IDs dos livros para buscar gêneros e autores
        const bookIds = books.map(book => book.bookId);

        // Busca gêneros e autores dos livros
        const genresAndAuthors = await this.getGenresAndAuthors(bookIds);
        if (!genresAndAuthors) return { success: false, message: "Error retrieving genres and authors" };

        // Calcula os gêneros e autores mais frequentes
        const topGenres = this.getTopOccurrences(genresAndAuthors.genres, 6);
        const topAuthors = this.getTopOccurrences(genresAndAuthors.authors, 3);

        // Salva os gêneros e autores no Redis
        await this.redisClientService.saveUserPreferredGenresForCollections(userId, collectionId, topGenres); // Salva gêneros
        await this.redisClientService.saveUserPreferredAuthorsForCollection(userId, collectionId, topAuthors); // Salva autores

        // Retorna o resultado com os gêneros e autores mais frequentes
        return { success: true, message: "Top genres and authors retrieved successfully"};
    };

    //Função para identificar os gêneros mais presentes na coleção geral de um usuário
    private async mainGenresInShelfCollection(userId: string) {
        // Pesquisa todas as coleções de um usuário
        const allCollections = await this.collectionService.listCollectionsOfUser(userId);
        if (allCollections.length === 0) return { success: false, message: "User does not have collections" };

        const allGenres: string[] = [];

        // Itera sobre cada coleção e recupera os gêneros do Redis
        for (const collection of allCollections) {
            // Busca os gêneros da coleção no Redis
            const cachedGenres = await this.redisClientService.getUserPreferredGenresForCollections(userId, collection.id);
            if (cachedGenres && cachedGenres.length > 0) {
                allGenres.push(...cachedGenres); // Agrega os gêneros da coleção
            }else{ continue;}
        }

        if (allGenres.length === 0) return { success: false, message: "No genres found in user's collections" };

        // Calcula os gêneros mais frequentes em todas as coleções
        const topGenres = this.getTopOccurrences(allGenres, 6);

        // Salva os gêneros gerais preferidos do usuário no Redis
        await this.redisClientService.saveUserPreferredAllGenres(userId, topGenres);

        // Retorna os gêneros principais
        return { success: true, message: "Top genres for all collections retrieved successfully" };
    };

    //Função para buscar gêneros e autores dos livros
    private async getGenresAndAuthors(bookIds: string[]) {
        const genresAndAuthors = await prisma.book.findMany({
            where: { id: { in: bookIds } },
            select: {
                mainGenre: true, // Array de gêneros ou relacionamento
                author: true  // Nome do autor como string
            }
        });

        const genres: string[] = [];
        const authors: string[] = [];

        genresAndAuthors.forEach(book => {
            // Quebrando o gênero principal em categorias separadas
            if (book.mainGenre) {
                const splitGenres = book.mainGenre.split(' / '); // Dividindo pelo caractere "/"
                genres.push(...splitGenres); // Adicionando todas as partes como gêneros individuais
            }
            if (book.author) {
                const authorNames = book.author.split(' | '); // Dividindo pelo caractere " | "
                authors.push(authorNames[0]); // Pegando apenas o primeiro nome
            }
        });

        return { genres, authors };
    };

    //Função para obter os itens mais frequentes em um array
    private getTopOccurrences(items: string[], topN: number): string[] {
        const count: Record<string, number> = {};

        items.forEach(item => {
            count[item] = (count[item] || 0) + 1;
        });

        return Object.entries(count)
            .sort(([, a], [, b]) => b - a)
            .slice(0, topN)
            .map(([item]) => item);
    };
};
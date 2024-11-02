//Importações
import { prisma } from "./prisma";

//Types
import { CreateBookDTO } from "../types/bookTypes";

//Services
import { GoogleBookService } from "./GoogleBookServices";

//Class
export class BookService {

    private googleService: GoogleBookService;

    constructor() {
        this.googleService = new GoogleBookService();
    }

    //Método para listar se um determinado livro existe
    async getBookInDataBaseWithID(id: string) {
        const book = await prisma.book.findUnique({
            where: { id }
        });

        return book;
    }

    //Método para listar livros presentes no banco de dados (pesquisa por título)
    async searchBooksInDataBaseForTitle(title: string) {
        const book = await prisma.book.findUnique({
            where: { title }
        });

        return book;
    };

    //Método para listar livros presentes no banco de dados (pesquisa por ISBN)
    async searchBooksInDataBaseForISBN(ISBN: string) {
        const book = await prisma.book.findMany({
            where: {
                OR: [
                    { ISBN_10: ISBN },
                    { ISBN_13: ISBN }
                ]
            }
        });

        return book;
    };

    //Método para procurar na API GOOGLE BOOKS (pesquisa por título)
    async searchBookInExternalApiForTitle(title: string) {
        const allBooks = await this.googleService.searchBookForTitle(title);

        //Valida que há dados
        if (!allBooks?.items || allBooks.items.length === 0) {
            return { success: false, message: "No books found for the provided title", data: null };
        };

        // Adaptar todos os livros retornados
        const adaptedBooks = await Promise.all(
            allBooks.items.map((book: any) => this.adapterTypesDatas(book))
        );

        return { success: true, message: "Books foun in the external API", data: adaptedBooks };
    };

    //Método para procurar na API GOOGLE BOOKS (pesquisa por ISBN)
    async searchBookInExternalApiForISBN(ISBN: string) {
        const allBooks = await this.googleService.searchBookForISBN(ISBN);

        //Valida que há dados
        if (!allBooks?.items || allBooks.items.length === 0) {
            return { success: false, message: "No books found for the provided ISBN", data: null };
        };

        //Adaptando tipo de dado
        const book = allBooks?.items[0];
        const adaptedBook = await this.adapterTypesDatas(book);

        //Retornando a resposta
        return { success: true, message: "Books foun in the external API", data: adaptedBook };
    };

    //Método para procurar na API GOOGLE BOOKS (pesquisa por Gênero)
    async searchBookInExternalApiForGenre(genre: string) {
        const allBooks = await this.googleService.searchBookForGenres(genre);

        //Valida que há dados
        if (!allBooks?.items || allBooks.items.length === 0) {
            return { success: false, message: "No books found for the provided ISBN", data: null };
        };

        // Adaptar todos os livros retornados
        const adaptedBooks = await Promise.all(
            allBooks.items.map((book: any) => this.adapterTypesDatas(book))
        );

        //Retornando a resposta
        return { success: true, message: "Books foun in the external API", data: adaptedBooks };
    };

    //Método para procurar na API GOOGLE BOOKS (pesquisa por Autor)
    async searchBookInExternalApiForAuthor(author: string) {
        const allBooks = await this.googleService.serachBookForAuthor(author);

        //Valida que há dados
        if (!allBooks?.items || allBooks.items.length === 0) {
            return { success: false, message: "No books found for the provided ISBN", data: null };
        };

        // Adaptar todos os livros retornados
        const adaptedBooks = await Promise.all(
            allBooks.items.map((book: any) => this.adapterTypesDatas(book))
        );

        //Retornando a resposta
        return { success: true, message: "Books foun in the external API", data: adaptedBooks };
    };

    //Método para adicionar um livro no banco de dados
    async addtingBookInDataBase(book: CreateBookDTO) {
        try {
            const createBook = await prisma.book.create({
                data: { ...book }
            })

            return createBook;
        } catch (error) {
            console.error("Error in creating book: ", error);
            throw new Error("Error in creating book");
        }
    };

    //Método para remover um livro do banco de dados
    async removingBookInDataBase(id: string) {
        try {
            await prisma.book.delete({
                where: { id }
            });

            return "Book removed";

        } catch (error) {
            console.error("Error in remove book: ", error);
            throw new Error("Error in remove book on database");
        }
    };

    // Método para converter os dados vindo da API Externa Para o tipo de dado
    async adapterTypesDatas(item: any): Promise<CreateBookDTO> {
        const book: CreateBookDTO = {
            author: item.volumeInfo.authors && item.volumeInfo.authors.length > 0
                ? item.volumeInfo.authors.join(' | ')
                : 'Unknown Author',
            coverImage: item.volumeInfo.imageLinks?.thumbnail || 'Unknown Thumbnail',
            mainGenre: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Unknown Genre',
            publisheData: item.volumeInfo.publishedDate || 'Unknown Date',
            publisher: item.volumeInfo.publisher || 'Unknown Publisher',
            quantityPages: item.volumeInfo.pageCount || 0,
            title: item.volumeInfo.title || 'Unknown Title',
            ISBN_10: item.volumeInfo.industryIdentifiers
                ? item.volumeInfo.industryIdentifiers.find((id: any) => id?.type === "ISBN_10")?.identifier || 'Unknown ISBN'
                : 'Unknown ISBN',
            ISBN_13: item.volumeInfo.industryIdentifiers
                ? item.volumeInfo.industryIdentifiers.find((id: any) => id?.type === "ISBN_13")?.identifier || 'Unknown ISBN'
                : 'Unknown ISBN',
            secondaryGenre: item.volumeInfo.categories && item.volumeInfo.categories.length > 1
                ? item.volumeInfo.categories[1]
                : undefined, // Gênero secundário, se existir
            subTitle: item.volumeInfo.subtitle || undefined,
            summary: item.volumeInfo.description || 'Unknown Summary', // Resumo
        };

        return book;
    }


}
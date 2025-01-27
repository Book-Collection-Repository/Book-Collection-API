//Importações
import axios from "axios";

//Class
export class GoogleBookService {
    private googleApiUrl: string;
    private googleApiKey: string;

    constructor () {
        //Buscando variáveis de ambiente
        const urlGoogleApi = process.env.GOOGLE_API;
        const keyGoogleApi = process.env.GOOOGLE_API_KEY;

        //Validando que elas são válidas
        if (!urlGoogleApi || !keyGoogleApi) throw new Error("Url for API GOOGLE BOOK is not found");
        
        //Settando atributos privados
        this.googleApiUrl= urlGoogleApi;
        this.googleApiKey = keyGoogleApi;
    };

    //Método para gerar um lista de livros aleatórios
    async listFetchRandomBooks (query: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes`, {
                params: {
                    q: query,
                    key: this.googleApiKey,
                    maxResults: 20,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book: ", error);
            throw new Error("Error in search book for title");
        }
    };

    //Método para procurar livros por título
    async searchBookForTitle (title: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes`, {
                params: {
                    q: `intitle:${title}`,
                    key: this.googleApiKey
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book: ", error);
            throw new Error("Error in search book for title");
        }
    };

    //Método para procurar livros por isbn
    async searchBookForISBN(isbn: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes`, {
                params: {
                    q: `isbn:${isbn}`,
                    key: this.googleApiKey,
                    download: 'epub'
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book: ", error);
            throw new Error("Error in search book for ISBN");
        }
    }

    //Método para procurar livros por gêneros
    async searchBookForGenres(genre: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes`, {
                params: {
                    q: `subject:${genre}`,
                    key: this.googleApiKey,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book: ", error);
            throw new Error("Error in search book for genres");
        }
    }

    //Método para procurar livros por autores
    async serachBookForAuthor(author: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes`, {
                params: {
                    q: `inauthor:${author}`,
                    key: this.googleApiKey
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book: ", error);
            throw new Error("Error in search book for author");
        }
    };

    // Método para procurar livro por ID
    async searchBookById(bookId: string) {
        try {
            const response = await axios.get(`${this.googleApiUrl}/volumes/${bookId}`, {
                params: {
                    key: this.googleApiKey
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in search book by ID: ", error);
            throw new Error("Error in search book by ID");
        }
    };
}
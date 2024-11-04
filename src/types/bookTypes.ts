//Definindo um interface para o tipo de livro
export interface book {
    id: string;
    externalID: string;
    ISBN_13?: string;
    ISBN_10?: string;
    title: string;
    subTitle?: string;
    coverImage: string;
    summary?: string;
    author: string;
    publisher: string;
    publisheData: string;
    quantityPages: number;
    mainGenre: string;
    secondaryGenre?: string;
};

//Tipo de dados usados nas requisições
export type CreateBookDTO = Omit<book, 'id'>;
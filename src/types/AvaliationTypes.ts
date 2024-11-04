//Definindo um interface padrão
export interface Avaliation {
    id: string;
    content: string;
    evaluationGrade: number;
    userId: string;
    bookId: string;
    createdAt: Date;
};

//Definindo um tipo que será usado nas requisições
export type AvalaitonDTO = Omit<Avaliation, 'id' | 'createdAt'>;

//Definindo um tipo que será usado na requisição de post
export type CreateAvalaitonDTO = Omit<Avaliation, 'id' | 'userId' | 'bookId' | 'createdAt'>;
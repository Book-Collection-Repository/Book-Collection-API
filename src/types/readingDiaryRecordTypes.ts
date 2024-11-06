//Definindo uma interface padrão com o tipo de dado
export interface RecordDiary {
    id: string;
    content: string;
    pagesRead: number;
    evaluationGrade: number;
    createdAt: string;
    readingDiaryId: string;
};

//Definindo um tipo usado nas requisições
export type RecordDiaryDTO = Omit<RecordDiary, 'id' | 'createdAt' | 'readingDiaryId'>
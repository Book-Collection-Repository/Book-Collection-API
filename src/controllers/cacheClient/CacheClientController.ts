//Importações
import { Request, Response } from "express";

//Services
import { AvaliationCacheServices } from "../../services/cacheClient/AvaliationCacheServices";
import { CollectionCacheServices } from "../../services/cacheClient/CollectionCacheServices";
import { FollwersCacheServices } from "../../services/cacheClient/FollwersCacheServices";
import { PublicationCacheServices } from "../../services/cacheClient/PublicationCacheServices";
import { ReadingDiariesCacheServices } from "../../services/cacheClient/ReadingDiariesCacheServices";
import { ReccomendCacheServices } from "../../services/cacheClient/ReccomendBooksServices";

//Class
export class CacheClientController {
    private publication: PublicationCacheServices;
    private avaliation: AvaliationCacheServices;
    private collection: CollectionCacheServices;
    private follow: FollwersCacheServices;
    private diaires: ReadingDiariesCacheServices;
    private books: ReccomendCacheServices;

    constructor() {
        this.publication = new PublicationCacheServices();
        this.avaliation = new AvaliationCacheServices();
        this.collection = new CollectionCacheServices();
        this.follow = new FollwersCacheServices();
        this.diaires = new ReadingDiariesCacheServices();
        this.books = new ReccomendCacheServices();
    }

    /** ================= METHODS OF AVALIATIONS ===================*/
    async getListAllAvaliations(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allAvaliations = await this.avaliation.getListAllAvaliations(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all avaliations of user", data: allAvaliations });
        } catch (error) {
            console.error("Erro in return all avaliations of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveAllAvaliations(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados do usuário
            const idUser =  req.id_User;
            const avaliations = req.body.avaliations;

            //Salvando os dados do usuário
            await this.avaliation.saveAllAvaliations(idUser, avaliations);

            return res.status(201).json({message: "Salved avaliations datas of user"});
        } catch (error) {
            console.error("Erro in salved all avaliations of user:", error);
            return res.status(500).json({ error: error });
        }
    };

    /** ================= METHODS OF COLLECTIONS ===================*/
    async getListAllCollections(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allCollections = await this.collection.getListAllCollections(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all collections of user", data: allCollections });
        } catch (error) {
            console.error("Erro in return all collections of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveAllCollections(req: Request, res: Response): Promise<Response> {
        try {
            //Busacando dados de usuário
            const idUser = req.id_User;
            const collections = req.body.collections;

            //Salvando dados no cache
            await this.collection.saveAllCollections(idUser, collections);

            return res.status(201).json({message: "Salved collections datas of user"});
        } catch (error) {
            console.error("Erro in salved all collections of user:", error);
            return res.status(500).json({ error: error });
        }
    };

    async getListDataCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;

            //Busanco as avaliações do usuário
            const collectionData = await this.collection.getListCollection(idUser, idCollection);

            //Retornando dados
            return res.status(200).json({ message: "Datas of collection of user", data: collectionData });
        } catch (error) {
            console.error("Erro in return collection of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    /** ================= METHODS OF FOLLOWERS AND FOLLOWEDS ===================*/
    async getListAllFollowers(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allFollowers = await this.follow.getListAllFollowers(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all followers of user", data: allFollowers });
        } catch (error) {
            console.error("Erro in return all followers of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async salvedListAllFollowers(req: Request, res: Response): Promise<Response> {
        try {
            //Busacando dados de usuário
            const idUser = req.id_User;
            const followers = req.body.followers;

            //Salvando dados no cache
            await this.follow.saveFollowers(idUser, followers);

            return res.status(201).json({message: "Salved followers datas of user"});
        } catch (error) {
            console.error("Erro in salved all followers of user:", error);
            return res.status(500).json({ error: error });
        }
    };

    async getListAllFolloweds(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allFolloweds = await this.follow.getListAllFolloweds(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all followeds of user", data: allFolloweds });
        } catch (error) {
            console.error("Erro in return all followeds of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async salvedListAllFolloweds(req: Request, res: Response): Promise<Response> {
        try {
            //Busacando dados de usuário
            const idUser = req.id_User;
            const followeds = req.body.followeds;

            //Salvando dados no cache
            await this.follow.saveFolloweds(idUser, followeds);

            return res.status(201).json({message: "Salved followeds datas of user"});
        } catch (error) {
            console.error("Erro in salved all followeds of user:", error);
            return res.status(500).json({ error: error });
        }
    };

    /** ================= METHODS OF ALL PUBLICATIONS ===================*/
    async getListAllpublications(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allPublications = await this.publication.getListAllpublications(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all publications of user", data: allPublications });
        } catch (error) {
            console.error("Erro in return all publications of user: ", error);
            return res.status(500).json({ error: error });
        }    
    }; 

    async saveAllPublications(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados do usuário
            const idUser =  req.id_User;
            const publication = req.body.publications;

            //Salvando os dados do usuário
            await this.publication.saveAllPublications(idUser, publication);

            return res.status(201).json({message: "Salved publications datas of user"});
        } catch (error) {
            console.error("Erro in salved all publications of user:", error);
            return res.status(500).json({ error: error });
        }
    };

    /** ================= METHODS OF READING DIARIES ===================*/
    async getListAllDiaries(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allDiaries = await this.diaires.getListAllReadingDiaries(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all reading diaires of user", data: allDiaries });
        } catch (error) {
            console.error("Erro in return all reading diaries of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async salvedListAllDiaries(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados do usuário
            const idUser =  req.id_User;
            const diaires = req.body.diaries;

            //Salvando os dados do usuário
            await this.diaires.saveAllReadingDiaries(idUser, diaires);

            return res.status(201).json({message: "Salved all diaries datas of user"});
        } catch (error) {
            console.error("Erro in salved all diaries of user:", error);
            return res.status(500).json({ error: error });
        }
    }

    async getListDataDiary(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idDiary = req.params.idDiary;

            //Busanco as avaliações do usuário
            const diaryData = await this.diaires.getListReadingDiaries(idUser, idDiary);

            //Retornando dados
            return res.status(200).json({ message: "Datas of a reading diairy of user", data: diaryData });
        } catch (error) {
            console.error("Erro in return a reading diary of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    /** ================= METHODS OF ALL RECCOMENDATIONS ===================*/
    async getListBooksReccomedations(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const allReccomendations = await this.books.getListAllReccomendations(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all reccomendations of user", data: allReccomendations });
        } catch (error) {
            console.error("Erro in return all reccomendations of user: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveBookRecommendations(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const data = req.body.reccomendations;

            //Salvando os dados do usuário
            await this.books.saveAllReccomendations(idUser, data);

            //Retornando dados
            return res.status(200).json({ message: "Datas of all recomendations of user are salved" });
        } catch (error) {
            console.error("Erro in salved reccomendations of user: ", error);
            return res.status(500).json({ error: error });
        }
    };
    
    /** ================= METHODS OF PREFERENCES FOR COLLECTION ===================*/
    async getListPrefferencesForCollecton(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;

            //Busanco as avaliações do usuário
            const prefferences = await this.books.getListPrefferencesForCollection(idUser, idCollection);

            //Retornando dados
            return res.status(200).json({ message: "Datas of prefferences of user's collection", data: prefferences });
        } catch (error) {
            console.error("Erro in return prefferences of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveBookPrefferencesForCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;
            const data = req.body.prefferences;

            //Salavando informaões do usuário
            await this.books.savePrefferencesForCollection(idUser, idCollection, data);

            //Retornando dados
            return res.status(200).json({ message: "Salved of prefferences of user's collection"});
        } catch (error) {
            console.error("Erro in salved prefferences of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };
    
    /** ================= METHODS OF RECCOMENDATIONS FOR COLLECTION ===================*/
    async getListReccomendationsForCollecton(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;

            //Busanco as avaliações do usuário
            const recomendations = await this.books.getListReccomendationsForCollection(idUser, idCollection);

            //Retornando dados
            return res.status(200).json({ message: "Datas of reccomendations of user's collection", data: recomendations });
        } catch (error) {
            console.error("Erro in return recomendations of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveBookRecomendationsForCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;
            const data = req.body.reccomendations;

            //Salavando informaões do usuário
            await this.books.saveReccomendationsForCollection(idUser, idCollection, data);

            //Retornando dados
            return res.status(200).json({ message: "Salved of recomendations of user's collection"});
        } catch (error) {
            console.error("Erro in salved recomendations of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };
    
    /** ================= METHODS OF SEARCH BOOKS ===================*/
    async getListSearchBooks(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;

            //Busanco as avaliações do usuário
            const searchBooks = await this.books.getListSearchBooks(idUser);

            //Retornando dados
            return res.status(200).json({ message: "Datas of books search of user's collection", data: searchBooks });
        } catch (error) {
            console.error("Erro in return books search of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };

    async saveSearchBooks(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados
            const idUser = req.id_User;
            const data = req.body.books;

            //Salavando informaões do usuário
            await this.books.saveSearchBooks(idUser, data);

            //Retornando dados
            return res.status(201).json({ message: "Salved of books search of user's collection"});
        } catch (error) {
            console.error("Erro in salved books search of user's collection: ", error);
            return res.status(500).json({ error: error });
        }
    };
}
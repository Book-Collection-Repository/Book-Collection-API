//Importações
import { Request, Response } from "express";
import { ZodError } from "zod";
import { validate } from "uuid";

//Services
import { UserService } from "../services/UserService";
import { RedisClientService } from "../services/RedisClientService";
import { CollectionService } from "../services/CollectionService";

//Type
import { CreateUserDTO, AuthenticateUserDTO, UpdateProfileUserDTO, UpdatePasswordUserDTO } from "../types/userTypes";

//Validators
import { authenticateUserSchema, createUserSchema, updatePasswordSchema, updateProfileSchema } from "../validators/userValidatior";

//Utils
import { hashPassword, checkePassword } from "../utils/userUtils/hashPassword";
import { handleZodError } from "../utils/errorHandler";
import { generateToken } from "../utils/userUtils/generateToken";
import { UserCacheServices } from "../services/cacheClient/UserCacheServices";

//Class
export class UserController {
    private userService: UserService;
    private redisClientService: RedisClientService;
    private collectionService: CollectionService;
    private redisCacheUser: UserCacheServices;

    constructor() {
        this.userService = new UserService();
        this.redisClientService = new RedisClientService();
        this.collectionService = new CollectionService();
        this.redisCacheUser = new UserCacheServices();
    };

    // Listar todos os usuários
    async findAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const allUsers = await this.userService.getAllUsers();

            return res.status(200).json({ allUsers });
        } catch (error) {
            console.error("Error return user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Listar um usuário por ID
    async searchUserForId(req: Request, res: Response): Promise<Response> {
        try {
            //Pega o id do usuário
            const idUser = req.params.id;
            if (!validate(idUser)) return res.status(400).json({ error: "Invalid ID format" });

            //Primeiro procura no redis
            const cachedUser = await this.redisCacheUser.getListUser(idUser);
            if (cachedUser) return res.status(200).json({ searchUser: cachedUser });

            //Caso não encontre, realiza a pesquisa
            const searchUser = await this.userService.getUserByID(idUser);

            // Verificar se o usuário foi encontrado
            if (!searchUser) return res.status(404).json({ error: "User not found" });

            // Armazenar o usuário no Redis para consultas futuras
            await this.redisCacheUser.saveUser(idUser, searchUser);

            //Retornando o usuário
            return res.status(200).json({ searchUser });
        } catch (error) {
            console.error("Error return user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Listar um usuário por Token
    async searchUserForToken(req: Request, res: Response): Promise<Response> {
        try {
            //Pega o id do usuário
            const idUser = req.id_User;
            
            //Primeiro procura no redis
            const cachedUser = await this.redisCacheUser.getListUser(idUser);
            if (cachedUser) return res.status(200).json({ searchUser: cachedUser });

            //Caso não encontre, realiza a pesquisa
            const searchUser = await this.userService.getUserByID(idUser);

            // Verificar se o usuário foi encontrado
            if (!searchUser) return res.status(404).json({ error: "User not found" });

            // Armazenar o usuário no Redis para consultas futuras
            await this.redisCacheUser.saveUser(idUser, searchUser);

            //Retornando o usuário
            return res.status(200).json({ searchUser });
        } catch (error) {
            console.error("Error return user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Listar um usuário por ProfileName
    async searchUserForProfileName(req: Request, res: Response): Promise<Response> {
        try {
            const profileName = req.params.profileName;

            // Verificar se o profileName foi fornecido
            if (!profileName || typeof profileName !== 'string' || profileName.trim() === '') return res.status(400).json({ error: "Profile name must be a non-empty string" });

            //Primeiro procura no redis
            const cachedUser = await this.redisClientService.getUserData(profileName);
            if (cachedUser) return res.status(200).json({ message: "Data of Redis Client", searchUser: cachedUser });

            //Caso não encontre, realiza a pesquisa
            const searchUser = await this.userService.getUserByProfileName(profileName);

            // Verificar se o usuário foi encontrado
            if (!searchUser) return res.status(404).json({ error: "User not found" });

            // Armazenar o usuário no Redis para consultas futuras
            await this.redisClientService.saveUserData(profileName, searchUser);

            return res.status(200).json({ searchUser });
        } catch (error) {
            console.error("Error return user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Criação de um usuário
    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const dataUser: CreateUserDTO = createUserSchema.parse(req.body);

            // Verificar se o email ou nome de perfil já existe no sistema
            const validationError = await this.userService.validateUserInformation(dataUser.email, dataUser.profileName);
            if (validationError) return res.status(409).json({ error: validationError });

            // Criptografar a senha do usuário
            const passwordHash = await hashPassword(dataUser.password);

            // Preparar os dados do novo usuário
            const userForCreating: CreateUserDTO = { ...dataUser, password: passwordHash };

            // Criar o novo usuário
            const newUser = await this.userService.createUser(userForCreating);
            if (!newUser) return res.status(400).json({error: "Creating user not completed"});

            // Criando coleções padrão do usuário
            const defaultCollection = await this.collectionService.createDefaultCollections(newUser.id);
            if (!defaultCollection.success) return res.status(defaultCollection.status).json({error: defaultCollection.message}); 

            // Retornar o novo usuário criado
            return res.status(201).json({newUser});

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Autenticando um usuário
    async authenticateUser(req: Request, res: Response): Promise<Response> {
        try {
            //Recebe os dados da requisição
            const dataUser: AuthenticateUserDTO = authenticateUserSchema.parse(req.body);

            //Valida o email
            const userEmailExist = await this.userService.getUserByEmail(dataUser.email);
            if (!userEmailExist) return res.status(404).json({ error: "User with email not found" });

            //Valida a senha
            const isPasswordCorrect = await checkePassword(dataUser.password, userEmailExist?.password);
            if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid password" });    

            //Gera o token
            const tokenResult = generateToken(userEmailExist?.profileName, userEmailExist?.id);
            if (!tokenResult.success) return res.status(500).json({ error: tokenResult.message }); // Retorna a mensagem de erro

            //Retorna o token gerado
            return res.status(200).json({ token: tokenResult.token });

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error creating user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Autenticação válida
    async authenticateUserIsValid(req: Request, res: Response): Promise<Response> {
        return res.status(200).json({ message: "Token is valid" });
    };

    //Edição de perfil
    async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando e validando as informações do banco
            const idUser = req.id_User;
            const dataUser: UpdateProfileUserDTO = updateProfileSchema.parse(req.body);

            //Validando a existência do usuário
            const userExistWithID = await this.userService.getUserByID(idUser);
            if (!userExistWithID) return res.status(404).json({ error: "User not found with ID" });

            // Verificação do bloqueio otimista
            const lockCheck = await this.userService.lockedOptimistUser(idUser, dataUser.version);
            if (!lockCheck.success) return res.status(lockCheck.status).json({ error: lockCheck.message });

            //Validar que não há nenhum outro usuário com essas informações
            const userExistUserWithInformations = await this.userService.validateUserInformationUpdate(dataUser.email, dataUser.profileName, idUser);
            if (userExistUserWithInformations) return res.status(400).json({ error: userExistUserWithInformations });

            //Atualizando os dados do usuário
            const updateUser = await this.userService.updateUser({ ...dataUser, version: dataUser.version + 1 }, idUser);

            return res.status(200).json({ message: "Profile updated successfully", data: updateUser })

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error updating user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Edição de senha
    async updatePassword(req: Request, res: Response): Promise<Response> {
        try {
            //Validando os campos vindo pela requisição
            const dataUser: UpdatePasswordUserDTO = updatePasswordSchema.parse(req.body);

            //Validando que o usuário existe
            const userExistWithEmail = await this.userService.getUserByEmail(dataUser.email);
            if (!userExistWithEmail) return res.status(404).json({ error: "User with email not found" });

            //Criptografando a senha
            const passwordHash = await hashPassword(dataUser.password);

            //Envia os dados para o service
            const updateUser = await this.userService.updatePasswordUser({ ...dataUser, password: passwordHash});

            return res.status(200).json({ message: "Password update sucessfully", updadeUser: updateUser });

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error updating user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Edição ou adição de foto de perfil
    async updateProfilePhoto(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário
            const idUser = req.id_User;

            //Pegando a versão do usuário
            const {version} = req.body;

            //Pagando a imagem passada
            const requestImage = req.file as Express.Multer.File;

            //Validando que as informações existem
            if (!requestImage) return res.status(400).json({ error: "File not existed" });

            //Buscando usuário e validando que ele existe
            const userExistWithID = await this.userService.getUserByID(idUser);
            if (!userExistWithID) return res.status(404).json({ error: "User not found with ID" });

            // Verificação do bloqueio otimista
            if (version === null || version === undefined) return res.status(404).json({error: "Version is required"});
            const lockCheck = await this.userService.lockedOptimistUser(idUser, parseInt(version));
            if (!lockCheck.success) return res.status(lockCheck.status).json({ error: lockCheck.message });

            //Salvando no banco de dados
            const userUpdatedImage = await this.userService.updatePhotoUser(idUser, `images/${requestImage.filename}`);

            return res.status(201).json({ massage: "Profile picture added", image: requestImage.filename, data: userUpdatedImage });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error uploading user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Remover perfil
    async deleteProfile(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário
            const idUser = req.id_User;

            //Deleta usuário
            const removeUser = await this.userService.removeUser(idUser);

            return res.status(200).json({ message: removeUser });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error deleting user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}
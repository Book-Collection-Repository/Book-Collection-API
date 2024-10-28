//Definindo uma interface
export interface User {
    id: string;
    userName: string;
    email: string;
    password: string;
    profileName: string;
    profileImage?: string;
    followersCount: number;
    followingCount: number;
    createdAt: Date;
    updatedAt: Date;
}

//Criando um tipo que será usado nas requisições
export type CreateUserDTO = Omit<User, 'id' | 'followersCount' | 'followingCount' | 'createdAt' | 'updatedAt'>;

// Criando um tipo que será usado na requisição de autenticação
export type AuthenticateUserDTO = {
    email: string;
    password: string;
};

//Criando um tipo que será usado na requisção de edição de perfil
export type UpdateProfileUserDTO =  {
    userName: string;
    email: string;
    profileName: string;
}

//Criando um tipo que serár usado na requisição de edição de senha
export type UpdatePasswordUserDTO = {
    email: string;
    password: string;
    confirmPassword: string;
};
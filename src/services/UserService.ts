//Importações
import { prisma } from "./prisma";

//Type
import { CreateUserDTO, UpdatePasswordUserDTO, UpdateProfileUserDTO } from "../types/userTypes";

//Class
export class UserService {

    //Retornar todos os usuários cadastrados no sistema
    async getAllUsers() {
        return await prisma.user.findMany({
            include: {
                avaliations: true,
                collections: true,
                publications: true,
                readingDiaries: true,
            }
        });
    }

    //Procura um usuário com um determinado id
    async getUserByID(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                avaliations: true,
                collections: true,
                publications: true,
                readingDiaries: true,
            }
        });

        return user;
    }

    //Procura um usuário com um determinado email
    async getUserByEmail(email: string) {
        const userEmail = await prisma.user.findUnique({
            where: { email },
            include: {
                avaliations: true,
                collections: true,
                publications: true,
                readingDiaries: true,
            }
        });

        return userEmail;
    };

    //Procurar um usuário com um determinado email, mas com id diferente
    async getUserByEmailButNotID(email: string, id: string) {
        const data = await prisma.user.findFirst({
            where: {
                email,
                id: { not: id }
            }
        });

        return data;
    };

    // Procura um usuário com um determinado nome de perfil
    async getUserByProfileName(profileName: string) {
        const userProfileName = await prisma.user.findUnique({
            where: { profileName },
            include: {
                avaliations: true,
                collections: true,
                publications: true,
                readingDiaries: true,
            }
        });

        return userProfileName;
    };

    //Procurando um usuário com um determinado nome de perfil, mas com id diferente
    async getUserByProfileNameButNotID(profileName: string, id: string) {
        const data = await prisma.user.findFirst({
            where: {
                profileName,
                id: { not: id }
            }
        });

        return data;
    }

    // Validando se existe um usuário com o mesmo e-mail ou nome de perfil
    async validateUserInformation(email: string, profileName: string): Promise<string | null> {
        const emailExists = await this.getUserByEmail(email);
        const profileNameExists = await this.getUserByProfileName(profileName);

        if (emailExists) return 'Email already exists';
        if (profileNameExists) return 'Profile name already exists';

        return null;
    };

    async validateUserInformationUpdate(email: string, profileName: string, idUser: string): Promise<string | null> {
        const emailExists = await this.getUserByEmailButNotID(email, idUser);
        const profileNameExists = await this.getUserByProfileNameButNotID(profileName, idUser);

        if (emailExists) return 'Email already exists';
        if (profileNameExists) return 'Profile name already exists';

        return null;
    };

    // Cria um usuário com as informações que foram passadas
    async createUser(data: CreateUserDTO) {
        try {
            const user = await prisma.user.create({
                data: { ...data },
                include: {
                    avaliations: true,
                    collections: true,
                    publications: true,
                    readingDiaries: true,
                }
            });

            return user;
        } catch (error) {
            console.error("Error creating user: ", error);
            throw new Error("Failed to create user");
        }
    };

    // Bloqueia operação concorrente
    async lockedOptimistUser(id: string, version: number) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (version !== user?.version) return { success: false, status: 400, message: "The user version is not compatible with the database version" };

        return { success: true, status: 200, message: "The user version compatible with the database version" };
    }

    // Editando as informações de um usuário
    async updateUser(data: UpdateProfileUserDTO, id: string) {
        try {
            const user = await prisma.user.update({
                where: { id },
                data: { ...data, },
                include: {
                    avaliations: true,
                    collections: true,
                    publications: true,
                    readingDiaries: true,
                }
            });

            return user;

        } catch (error) {
            console.error("Error updating user: ", error);
            throw new Error("Failed to update user");
        }
    };

    //Editando a senha de um usuário
    async updatePasswordUser(data: UpdatePasswordUserDTO) {
        try {
            const user = await prisma.user.update({
                where: { email: data.email },
                data: {
                    password: data.password
                }
            });

            return user;

        } catch (error) {
            console.error("Error updating user: ", error);
            throw new Error("Failed to update user");
        }
    };

    //Adicionando foto de perfil
    async updatePhotoUser(id: string, fileName: string) {
        try {
            const user = await prisma.user.update({
                where: { id },
                data: {
                    profileImage: fileName,
                    version: { increment: 1 }
                }
            });

            return user;

        } catch (error) {
            console.error("Error updating user: ", error);
            throw new Error("Failed to update user");
        }
    }

    //Incrementando os contadores de seguindo
    async incrementFollowingCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followingCount: { increment: 1 } },
        });
    };

    //Incrementeando os contadores de seguidores
    async incrementFollowersCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followersCount: { increment: 1 } },
        });
    };

    //Decremetando os contradores de seguindo
    async decrementFollowingCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followingCount: { decrement: 1 } },
        });
    };

    //Decrementeando os contadores de seguidores
    async decrementFollowersCount(id: string) {
        await prisma.user.update({
            where: { id },
            data: { followersCount: { decrement: 1 } },
        });
    };

    //Removendo um perfil de um usuário
    async removeUser(id: string) {
        try {
            await prisma.user.delete({
                where: { id },
            });

            return "User removed";
        } catch (error) {
            console.error("Error removing user: ", error);
            throw new Error("Failed to remove user");
        }
    };
}
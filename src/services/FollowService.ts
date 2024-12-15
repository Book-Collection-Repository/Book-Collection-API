//Importações
import { prisma } from "./prisma";
import { UserService } from "./UserService";

//Class
export class FollowService {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    //Listar todos os usuários que um usuário A segue
    async getUsersFollowedByUser(id: string) {
        const usersFollowed = await prisma.follow.findMany({
            where: { followerId: id },
            include: { 
                followed: true
            }
        });

        return usersFollowed;
    };

    //Listar todos os usuário que seguem um usuário A
    async getUsersFollowerByUser(id: string) {
        const userFollower = await prisma.follow.findMany({
            where: { followedId: id },
            include: { follower: 
                true 
            }
        });

        return userFollower;
    };

    //Listar os usuários que seguem o usuário A, mas que o usuário A não segue de volta
    async getFollowersNotFollowedBack(id: string) {
        const following = await this.getUsersFollowedByUser(id); //Seguindo do usuário A;
        const followers = await this.getUsersFollowerByUser(id); //Seguidores do usuário A;

        // Extrai os IDs para comparação
        const followersIds = followers.map((f) => f.followerId);
        const followingIds = following.map((f) => f.followedId);

        // Filtra os seguidores que o usuário A não segue
        const notFollowedBackIds = followersIds.filter(
            (followerId) => !followingIds.includes(followerId)
        );

        // Retorna os detalhes dos usuários que o usuário A não segue de volta
        return await prisma.user.findMany({
            where: { id: { in: notFollowedBackIds } },
        });
    };

    //Verificar se um usuário A segue um usuário B
    async isFollowing(userIdA: string, userIdB: string): Promise<boolean> {
        const followRelation = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: userIdA,
                    followedId: userIdB,
                },
            },
        });
        return followRelation !== null;
    };

    //Criar uma relação de seguimento entre o usuário A e o usuário B
    async followUser(followerId: string, followedId: string) {
        // Impede que o usuário siga a si mesmo
        if (followerId === followedId) {
            return { success: false, status: 400, message: "User cannot follow themselves" };
        }

        // Verifica se o usuário já está seguindo
        const alreadyFollowing = await this.isFollowing(followerId, followedId);
        if (alreadyFollowing) {
            return { success: false, status: 400, message: "The user is already following the target user" };
        }

        // Cria a relação de seguimento
        const followRelation = await prisma.follow.create({
            data: {
                followerId,
                followedId,
            },
        });

        // Incrementa os contadores de seguidores e seguidos
        await this.userService.incrementFollowingCount(followerId);
        await this.userService.incrementFollowersCount(followedId);

        // Retorna sucesso com a relação criada
        return { success: true, status: 201, message: "Follow created successfully", followRelation };
    };

    // Remover a relação de seguimento entre o usuário A e o usuário B
    async unfollowUser(followerId: string, followedId: string) {
        // Verifica se já está seguindo
        const alreadyUnFollowing = await this.isFollowing(followerId, followedId);
        if (!alreadyUnFollowing) {
            return { success: false, status: 400, message: "The user is already unfollowing the target user" };
        }

        // Remove a relação de seguimento
        await prisma.follow.delete({
            where: {
                followerId_followedId: {
                    followerId,
                    followedId,
                },
            },
        });

        // Decrementa os contadores de seguidores e seguidos
        await this.userService.decrementFollowingCount(followerId);
        await this.userService.decrementFollowersCount(followedId);

        return { success: true, status: 200, message: "Follow-up relationship successfully removed." };
    }
};
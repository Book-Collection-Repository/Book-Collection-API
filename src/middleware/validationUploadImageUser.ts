//Importações
import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/prisma";
import { UserService } from "../services/UserService";
import { existsSync, unlinkSync } from "fs";
import path from "path";

//Função
export async function validationUploadImageUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.id_User;
    const userService = new UserService();

    try {
        const existUser = await userService.getUserByID(userId)//Verificando a veracidade do usuário
    
        if (existUser?.profileImage && existUser.profileImage !== 'Unregistered profile picture' && existUser.profileImage !== null) {
            //Caminho do arquivo de foto do usuário
            const oldImagePath = path.join(__dirname, ".." , "..", "/uploads", path.basename(existUser.profileImage));
            
            //Só remove se existir
            if (existsSync(oldImagePath)) {
                unlinkSync(oldImagePath); //Remove arquivo do diretório
            }
        }
        next();
        
    } catch (error) {
        console.error('Error checking user and deleting old image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
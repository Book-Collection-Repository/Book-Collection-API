//Importações
import minioClient from '../connection/minioClient';
import { Readable } from 'stream';
import { prisma } from './prisma';

//Class
export class MinioService {
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.MINIO_BUCKET_NAME || 'book-collection-minio';
    }

    //Função para upload de imagem
    async uploadImage(fileName: string, fileBuffer: Buffer) {
        if (!fileBuffer || !(fileBuffer instanceof Buffer)) {
            throw new Error("File buffer is invalid or undefined");
        }

        const stream = Readable.from(fileBuffer); 
        //Enviando arquivo
        await minioClient.putObject(this.bucketName, fileName, stream);
    }

    //Função para dowload de imagem
    async dowloadImage(fileName: string) {
        return await minioClient.getObject(this.bucketName, fileName);
    }

    //Função para deletar a imagem
    async deleteImage(fileName: string) {
        await minioClient.removeObject(this.bucketName, fileName);
    }
}
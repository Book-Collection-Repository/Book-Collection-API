//Importações
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDIPOINT || 'minio-bookCollection', // IP ou domínio do MinIO
  port: 9000, // Porta configurada no Docker
  useSSL: false,
  accessKey: 'minioadmin', // MINIO_ROOT_USER (Docker)
  secretKey: 'minioadmin', // MINIO_ROOT_PASSWORD (Docker)
});

export default minioClient;

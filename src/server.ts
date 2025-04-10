import "./Env";
import express from 'express';
import path from 'path';
import cors from 'cors';

import Env from "./Env";

class Server {
    private server = express();

    constructor() {
        this.configureServer();
    }

    async configureServer() {
        this.server = express();
        
        // Ajustando o caminho para o diretório uploads corretamente
        const uploadsPath = path.resolve(__dirname, '..', 'uploads');
        console.log(`Serving static files from: ${uploadsPath}`);
        this.server.use('/uploads', express.static(uploadsPath));
        
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(express.json({ limit: '1mb' }));
        this.server.use(cors({
            origin: '*',
            exposedHeaders: 'x-total-count'
        }));
        
        this.server.listen(Env.PORT, () => {
            console.log(`Ambiente do Servidor: ${Env.SERVER_ENVIRONMENT}`);
            console.log(`stage: ${Env.STAGE}`);
            console.log(`Servidor na porta: ${Env.PORT}`);
        });
    }
}

export default Server;

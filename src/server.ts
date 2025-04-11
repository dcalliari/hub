import "./env";
import express from "express";
import path from "path";
import cors from "cors";

import env from "./env";
import testRoutes from "./test.routes";

class Server {
  private server = express();

  constructor() {
    this.configureServer();
    this.setupRoutes();
  }

  async configureServer() {
    this.server = express();

    // Ajustando o caminho para o diretório uploads corretamente
    const uploadsPath = path.resolve(__dirname, "..", "uploads");
    console.log(`Serving static files from: ${uploadsPath}`);
    this.server.use("/uploads", express.static(uploadsPath));

    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json({ limit: "1mb" }));
    this.server.use(
      cors({
        origin: "*",
        exposedHeaders: "x-total-count",
      })
    );

    this.server.listen(env.PORT, () => {
      console.log(`Ambiente do Servidor: ${env.SERVER_ENVIRONMENT}`);
      console.log(`stage: ${env.STAGE}`);
      console.log(`Servidor na porta: ${env.PORT}`);
    });
  }

  setupRoutes() {
    if (env.SERVER_ENVIRONMENT === "LocalMachine" || env.STAGE === "dev") {
      console.log("Configuring routes for test environment...");
      this.server.use(testRoutes);
    } else {
      console.log("Routes are not enabled in this environment.");
      this.server.use((req, res) => {
        res.status(404).json({ message: "Routes are not enabled in this environment." });
      });
    }
  }
}

export default Server;

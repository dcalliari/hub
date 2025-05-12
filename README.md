# Passo a Passo para Rodar o Projeto

1. **Clonar o Repositório**
  ```bash
  git clone git@github.com:Tecsomobi/carioca_hub.git
  ```

2. **Instalar Dependências**
  ```bash
  cd carioca_hub
  nvm use 20
  yarn
  ```

3. **Configurar Variáveis de Ambiente**
  - Crie o arquivo `.env` com base em `envs/dev.env`:
    ```bash
    yarn cli:create-env dev lm
    ```

4. **Configurar o Banco de Dados**
  ```bash
  yarn prisma generate
  ```

5. **Subir o RabbitMQ**
  ```bash
  docker-compose up -d
  ```

6. **Iniciar o Projeto**
  ```bash
  yarn dev
  ```

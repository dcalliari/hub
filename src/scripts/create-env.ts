import { readFileSync, writeFileSync } from "fs";
import { envSchema } from "../validations/env.schema";
import { parse as dotenvParse } from "dotenv";
import path from "path";

// Usage: yarn cli:create-env [stage] [lm|ds]

const AVAILABLE_ENVIROMENTS = {
  lm: "LocalMachine",
  ds: "DeployedServer",
};

// @ts-ignore
const SERVER_ENVIRONMENT = AVAILABLE_ENVIROMENTS[process.argv[3]] ?? "LocalMachine";

const STAGE = process.argv[2] ?? "test";

// load one of envs/ files by selected stage
// Read the .env file content
const stageEnvFilePath = path.join("envs", `${STAGE}.env`);
const stageEnvFileContent = readFileSync(stageEnvFilePath, { encoding: "utf8" });

// Parse the .env file content into an object
const envVariables = dotenvParse(stageEnvFileContent);

const newEnv = {
  ...envVariables,

  SERVER_ENVIRONMENT: SERVER_ENVIRONMENT,
  STAGE: STAGE,

  PORT: SERVER_ENVIRONMENT == "LocalMachine" ? "9121" : envVariables.PORT,
};

envSchema.parse(newEnv);

const envFileContent = Object.entries(newEnv)
  .map(([key, value]) => `${key}="${value}"`)
  .join("\n");

const envFilePath = path.join(".env" + (SERVER_ENVIRONMENT == "LocalMachine" ? ".dev" : ""));
console.log("saving env to:", envFilePath);

writeFileSync(envFilePath, envFileContent);

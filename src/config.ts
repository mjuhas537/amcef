require("dotenv").config();

// Získanie hodnoty premennej prostredia 'NODE_ENV'
const nodeEnv = process.env.NODE_ENV;

let host: string;
let password: string;

if (nodeEnv === "docker") {
  host = process.env.DOCKER_POSTGRES_HOST as string;
  password = process.env.DOCKER_POSTGRES_PASSWORD as string;
} else {
  host = process.env.LOCAL_POSTGRES_HOST as string;
  password = process.env.LOCAL_POSTGRES_PASSWORD as string;
}

console.log(`NODE_ENV: ${nodeEnv}, DB: host: ${host},  password: ${password}`);

export { host, password };

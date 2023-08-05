import { PoolConfig } from "pg";

export const dbConfig: PoolConfig = {
  user: "educc", 
  host: "localhost",
  database: "movies", 
  password: "1234", 
  port: 5432,
};

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type envType={
  DATABASE_URL: string;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env<envType>('DATABASE_URL'),
  },

});

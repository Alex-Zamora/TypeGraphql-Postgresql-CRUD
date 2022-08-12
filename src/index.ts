import "reflect-metadata";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TaskResolver } from "./resolvers/task";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { DataSource } from "typeorm";
import { Task } from "./entities/Task";

const main = async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    database: "crud-graphql-db",
    entities: [Task],
    logging: true,
    synchronize: true,
    username: "postgres",
    password: "postgres",
    port: 5432,
  });

  await AppDataSource.initialize();

  const app: Express = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TaskResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.get("/", (_req, res) => res.send("hello world"));

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

main().catch((err) => console.error(err));

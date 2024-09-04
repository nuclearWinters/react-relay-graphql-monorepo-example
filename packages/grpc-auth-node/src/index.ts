import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthService, AuthServer } from "@lerna-monorepo/backend-utilities";
import { MONGO_DB, REDIS, GRPC_AUTH } from "../../backend-utilities/src/config";

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  createClient({
    url: REDIS,
  }).connect(),
]).then(async ([mongoClient, redisClient]) => {
  const authdb = mongoClient.db("auth");
  const server = new Server();
  server.addService(AuthService, AuthServer(authdb, redisClient));
  server.bindAsync(GRPC_AUTH, ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
});

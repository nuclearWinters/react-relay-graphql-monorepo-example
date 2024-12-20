import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import type { AuthUserMongo } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, describe, it } from "node:test";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

describe("UpdateUser tests", async () => {
  const startedRedisContainer = await new RedisContainer().start();
  const startedMongoContainer = await new MongoDBContainer().start();
  const client = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstance = client.db("auth");
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  const server = await main(dbInstance, redisClient, {} as AccountClient);
  const request = supertest(server, { http2: true });

  after(async () => {
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
  });

  it("test UpdateUser valid access token", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const _id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id,
      name: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      isLender: true,
      isBorrower: false,
      isSupport: false,
      email: "armando10@gmail.com",
      password: "",
      language: "default",
      id,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "42158b2d4898c10429bee6ac923b8bbc",
        },
        query: "",
        variables: {
          input: {
            name: "Armando Narcizo",
            apellidoPaterno: "Rueda",
            apellidoMaterno: "Peréz",
            RFC: "RFC",
            CURP: "CURP",
            clabe: "clabe",
            mobile: "9831228788",
            language: "ES",
            email: "armando10@gmail.com",
          },
        },
        operationName: "UpdateUserMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.updateUser.error, "");
    ok(data.data.updateUser.authUser);
    const user = await users.findOne({
      _id,
    });
    deepStrictEqual(user, {
      _id,
      email: "armando10@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
      language: "es",
      mobile: "9831228788",
      name: "Armando Narcizo",
      CURP: "CURP",
      RFC: "RFC",
      apellidoMaterno: "Peréz",
      apellidoPaterno: "Rueda",
      clabe: "clabe",
      id,
    });
  });
});

import { main } from "../app.ts";
import supertest from "supertest";
import { MongoClient, type Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { createClient, type RedisClientType } from "redis";
import type TestAgent from "supertest/lib/agent.js";
import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { base64Name } from "@repo/utils";
import { parse, serialize } from "cookie";
import { isBefore } from "date-fns";
import type { AuthUserMongo, AuthUserSessions } from "@repo/mongo-utils";

describe("RevokeSessionMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let request: TestAgent<supertest.Test>;
  let grpcClient: AccountClient;
  let redisClient: RedisClientType;
  let startedRedisContainer: StartedRedisContainer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    startedRedisContainer = await new RedisContainer().start();
    redisClient = createClient({
      url: startedRedisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
    const server = await main(dbInstance, redisClient, grpcClient);
    request = supertest(server, { http2: true });
  });

  afterAll(async () => {
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
  });

  it("RevokeSessionMutation: is another user", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const sessions = dbInstance.collection<AuthUserSessions>("sessions");
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    const other_user_id = crypto.randomUUID();
    const other_session_oid = new ObjectId();
    const other_session_id = other_session_oid.toHexString();
    const other_session_gid = base64Name(other_session_id, "Session");
    const { refreshToken: otherRefreshToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: other_user_id,
      invalidAccessToken: true,
    });
    await sessions.insertOne({
      _id: other_session_oid,
      applicationName: "Lerna Monorepo",
      deviceOS: "lender",
      deviceBrowser: "Lender",
      address: "::1",
      lastTimeAccessed: new Date(),
      userId: other_user_id,
      expirationDate: new Date(),
      refreshToken: otherRefreshToken,
    });
    await users.insertOne({
      _id: user_oid,
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
      isLender: true,
      isBorrower: false,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id: user_id,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user_id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "360b8a63b14154e6762d64c916371a6e",
        },
        query: "",
        variables: {
          input: {
            sessionId: other_session_gid,
          },
        },
        operationName: "revokeSessionMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.revokeSession.error).toBeFalsy();
    expect(data.data.revokeSession.session.id).toBe(other_session_gid);
    expect(
      isBefore(data.data.revokeSession.session.expirationDate, new Date())
    ).toBeTruthy();
  });

  it("RevokeSessionMutation: is same user", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const sessions = dbInstance.collection<AuthUserSessions>("sessions");
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    const other_session_oid = new ObjectId();
    const other_session_id = other_session_oid.toHexString();
    const other_session_gid = base64Name(other_session_id, "Session");
    await users.insertOne({
      _id: user_oid,
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
      isLender: true,
      isBorrower: false,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id: user_id,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user_id,
    });
    await sessions.insertOne({
      _id: other_session_oid,
      applicationName: "Lerna Monorepo",
      deviceOS: "lender",
      deviceBrowser: "Lender",
      address: "::1",
      lastTimeAccessed: new Date(),
      userId: user_id,
      expirationDate: new Date(),
      refreshToken,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "360b8a63b14154e6762d64c916371a6e",
        },
        query: "",
        variables: {
          input: {
            sessionId: other_session_gid,
          },
        },
        operationName: "revokeSessionMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.revokeSession.error).toBeFalsy();
    expect(data.data.revokeSession.session.id).toBe(other_session_gid);
    expect(
      isBefore(data.data.revokeSession.session.expirationDate, new Date())
    ).toBeTruthy();
    const responseCookies = response.headers["set-cookie"][0];
    expect(responseCookies).toBeTruthy();
    const parsedCookies = parse(responseCookies);
    expect(parsedCookies.refreshToken).toBe("");
    const authorization = response.headers["authorization"];
    expect(authorization).toBeFalsy();
  });
});

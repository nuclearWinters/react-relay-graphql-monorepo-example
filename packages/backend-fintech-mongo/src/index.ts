import { main } from "./app";
import { MongoClient } from "mongodb";
import { credentials } from "@grpc/grpc-js";
import { Kafka, logLevel } from "kafkajs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import {
  MONGO_DB,
  KAFKA,
  KAFKA_ID,
  REDIS,
  GRPC_AUTH,
  IS_PRODUCTION,
  KAFKA_PASSWORD,
  KAFKA_USERNAME,
} from "@repo/utils/config";
import { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import fs from "node:fs";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
  ssl: IS_PRODUCTION ? true : false,
  sasl: IS_PRODUCTION
    ? {
        mechanism: "scram-sha-256",
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
      }
    : undefined,
  logLevel: IS_PRODUCTION ? logLevel.ERROR : undefined,
});

const producer = kafka.producer();

const retryStrategy = (times: number) => {
  return Math.min(times * 50, 2000);
};

const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS, { retryStrategy }),
  subscriber: new Redis(REDIS, { retryStrategy }),
});

const getGRPCClient = () =>
  new Promise<AuthClient>((resolve, reject) => {
    const client = new AuthClient(
      GRPC_AUTH,
      credentials.createSsl(
        fs.readFileSync("../../certs/minica.pem"),
        fs.readFileSync("../../certs/key.pem"),
        fs.readFileSync("../../certs/cert.pem"),
        IS_PRODUCTION
          ? undefined
          : {
              checkServerIdentity: () => undefined,
            }
      )
    );
    client.waitForReady(Date.now() + 5000, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });

Promise.all([
  MongoClient.connect(MONGO_DB),
  getGRPCClient(),
  producer.connect(),
]).then(async ([mongoClient, grpcClient]) => {
  const db = mongoClient.db("fintech");
  const serverHTTP2 = await main(db, producer, grpcClient, pubsub);
  serverHTTP2.on("unknownProtocol", () => {
    fs.writeFileSync("unknownProtocol.txt", `unknownProtocol`);
  });
  serverHTTP2.listen(443);
});

process
  .on("unhandledRejection", (reason) => {
    const now = new Date().toISOString();
    fs.writeFileSync(
      `unhandledRejectionLogs${now}.txt`,
      `Time: ${now}, Reason: ${String(reason)}`
    );
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    const now = new Date().toISOString();
    if (err.message === "read ECONNRESET") {
      fs.writeFileSync(
        `ECONNRESET${now}.txt`,
        `Time: ${now}, Reason: ${err.message}`
      );
      return;
    }
    if (
      err.message.includes(
        "routines:ssl3_read_bytes:sslv3 alert bad certificate"
      )
    ) {
      fs.writeFileSync(
        `BADCERT${now}.txt`,
        `Time: ${now}, Reason: ${err.message}`
      );
      return;
    }
    fs.writeFileSync(
      `uncaughtExceptionLogs${now}.txt`,
      `Time: ${now}, Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`
    );
    process.exit(1);
  });

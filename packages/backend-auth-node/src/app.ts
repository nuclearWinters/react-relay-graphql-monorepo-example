import fs from "node:fs";
import { createSecureServer } from "node:http2";
import { createHandler } from "@repo/graphql-utils";
import type { AccountClient } from "@repo/grpc-utils";
import { logErr } from "@repo/logs-utils";
import type { RedisClientType } from "@repo/redis-utils";
import { IS_PRODUCTION } from "@repo/utils";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import type { Db } from "mongodb";
import { QueryUser, nodeField } from "./AuthUserQuery.ts";
import { ExtendSessionMutation } from "./mutations/ExtendSessionMutation.ts";
import { LogOutMutation } from "./mutations/LogOutMutation.ts";
import { RevokeSessionMutation } from "./mutations/RevokeSessionMutation.ts";
import { SignInMutation } from "./mutations/SignInMutation.ts";
import { SignUpMutation } from "./mutations/SignUpMutation.ts";
import { UpdateUserMutation } from "./mutations/UpdateUserMutation.ts";
import queryMap from "./queryMapAuth.json" with { type: "json" };
import { getContextSSE } from "./utils.ts";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: SignUpMutation,
    signIn: SignInMutation,
    updateUser: UpdateUserMutation,
    extendSession: ExtendSessionMutation,
    logOut: LogOutMutation,
    revokeSession: RevokeSessionMutation,
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    authUser: QueryUser,
    node: nodeField,
  },
});

export const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});

const main = async (db: Db, rdb: RedisClientType, grpcClient: AccountClient) => {
  const handler = createHandler({
    schema,
    context: async (req, res) => {
      return await getContextSSE(req, res, db, rdb, grpcClient);
    },
    queryMap,
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync(IS_PRODUCTION ? "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/privkey.pem" : "../../certs/key.pem"),
      cert: fs.readFileSync(IS_PRODUCTION ? "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/fullchain.pem" : "../../certs/cert.pem"),
    },
    async (req, res) => {
      try {
        const origins = IS_PRODUCTION ? ["https://relay-graphql-monorepo.com"] : ["http://localhost:8000", "http://localhost:5173"];
        const origin = req.headers.origin;
        if (origin && origins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Expose-Headers", "Accesstoken");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        const isOptions = req.method === "OPTIONS";
        if (isOptions) {
          return res.writeHead(200).end();
        }
        if (req?.url?.startsWith("/graphql") && req.method === "POST") {
          return await handler(req, res);
        }
        return res.writeHead(200).end();
      } catch (err) {
        if (err instanceof Error) {
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "requestError",
            message: `Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`,
          });
        } else {
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "requestError",
            message: "Message: Unknown error",
          });
        }
        res.writeHead(500).end();
      }
    },
  );
  return server;
};

export { main };

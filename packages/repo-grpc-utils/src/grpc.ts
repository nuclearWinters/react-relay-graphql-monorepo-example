import { ACCESS_TOKEN_EXP_NUMBER, ACCESSSECRET, REFRESHSECRET } from "@repo/utils";
import { jwt } from "@repo/jwt-utils";
import type { AccountClient, IAccountServer } from "./protoAccount/account_grpc_pb.cjs";
import * as account from "./protoAccount/account_pb.cjs";
const {
  default: { CreateUserInput, CreateUserPayload },
} = account;
import type { AuthClient, IAuthServer } from "./protoAuth/auth_grpc_pb.cjs";
import type { JWTMiddlewareInput as AuthJWTMiddlewareInput, JWTMiddlewarePayload as AuthJWTMiddlewarePayload } from "./protoAuth/auth_pb.cjs";
import type { CreateUserInput as AccountCreateUserInput, CreateUserPayload as AccountCreateUserPayload } from "./protoAccount/account_pb.cjs";
import * as auth from "./protoAuth/auth_pb.cjs";
const {
  default: { JWTMiddlewareInput, JWTMiddlewarePayload },
} = auth;
import { Metadata, type ServerUnaryCall, type sendUnaryData, type ServiceError } from "@grpc/grpc-js";
import type { Db } from "mongodb";
import type { RedisClientType } from "@repo/redis-utils";
import type { AuthUserSessions } from "@repo/mongo-utils";
import type { UUID } from "node:crypto";

export const jwtMiddleware = (refreshToken: string, accessToken: string, client: AuthClient) =>
  new Promise<{
    id: UUID;
    isLender: boolean;
    isBorrower: boolean;
    isSupport: boolean;
    validAccessToken: string;
  }>((resolve) => {
    const request = new JWTMiddlewareInput();
    request.setRefreshToken(refreshToken);
    request.setAccessToken(accessToken);

    const metadata = new Metadata({ waitForReady: true });
    client.jwtMiddleware(request, metadata, (err, user) => {
      if (err) {
        //Should I return error and unauthorized status code?
        resolve({
          id: "" as UUID,
          isLender: false,
          isBorrower: false,
          isSupport: false,
          validAccessToken: "",
        });
      } else {
        const id = user.getId();
        const isLender = user.getIsLender();
        const isBorrower = user.getIsBorrower();
        const isSupport = user.getIsSupport();
        const validAccessToken = user.getValidAccessToken();
        resolve({
          id: id as UUID,
          isLender,
          isBorrower,
          isSupport,
          validAccessToken,
        });
      }
    });
  });

export const AuthServer = (authdb: Db, rdb: RedisClientType): IAuthServer => ({
  async jwtMiddleware(
    call: ServerUnaryCall<AuthJWTMiddlewareInput, AuthJWTMiddlewarePayload>,
    callback: sendUnaryData<AuthJWTMiddlewarePayload>,
  ): Promise<void> {
    try {
      const refreshToken = call.request.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const accessToken = call.request.getAccessToken();
      const isBlacklisted = await rdb.get(refreshToken);
      if (isBlacklisted) {
        throw new Error("El usuario esta bloqueado.");
      }
      if (accessToken) {
        try {
          const userAccess = jwt.verify(accessToken, ACCESSSECRET);
          if (!userAccess) {
            throw new Error("El token esta corrompido.");
          }
          const payload = new JWTMiddlewarePayload();
          payload.setValidAccessToken(accessToken);
          payload.setId(userAccess.id);
          payload.setIsBorrower(userAccess.isBorrower);
          payload.setIsLender(userAccess.isLender);
          payload.setIsSupport(userAccess.isSupport);
          return callback(null, payload);
        } catch (e) {
          if (e instanceof Error && e.name !== "TokenExpiredError") {
            throw e;
          }
        }
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        throw new Error("El token esta corrompido.");
      }
      const { isBorrower, isLender, isSupport, id } = user;
      const now = new Date();
      now.setMilliseconds(0);
      const accessTokenExpireTime = now.getTime() / 1_000 + ACCESS_TOKEN_EXP_NUMBER;
      const validAccessToken = jwt.sign(
        {
          isBorrower,
          isLender,
          isSupport,
          id,
          refreshTokenExpireTime: user.exp,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET,
      );
      const payload = new JWTMiddlewarePayload();
      payload.setValidAccessToken(validAccessToken);
      payload.setId(id);
      payload.setIsBorrower(isBorrower);
      payload.setIsLender(isLender);
      payload.setIsSupport(isSupport);
      const sessions = authdb.collection<AuthUserSessions>("sessions");
      sessions?.updateOne(
        {
          refreshToken,
        },
        {
          $set: {
            lastTimeAccessed: now,
          },
        },
      );
      callback(null, payload);
    } catch (e) {
      const error: ServiceError = {
        name: "Error Auth Service",
        message: e instanceof Error ? e.message : "",
        code: 1,
        details: "",
        metadata: new Metadata(),
      };
      callback(error, null);
    }
  },
});

export const createUser = (id: string, client: AccountClient): Promise<AccountCreateUserPayload> => {
  return new Promise<AccountCreateUserPayload>((resolve, reject) => {
    const request = new CreateUserInput();
    request.setId(id);

    client.createUser(request, (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
};

export const AccountServer = (db: Db): IAccountServer => ({
  async createUser(call: ServerUnaryCall<AccountCreateUserInput, AccountCreateUserPayload>, callback: sendUnaryData<AccountCreateUserPayload>): Promise<void> {
    try {
      const id = call.request.getId();
      const payload = new CreateUserPayload();
      await db.collection("users").insertOne({
        id,
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      });
      payload.setDone("");
      callback(null, payload);
    } catch (e) {
      const error: ServiceError = {
        name: "Error Auth Service",
        message: e instanceof Error ? e.message : "",
        code: 1,
        details: "",
        metadata: new Metadata(),
      };
      callback(error, null);
    }
  },
});

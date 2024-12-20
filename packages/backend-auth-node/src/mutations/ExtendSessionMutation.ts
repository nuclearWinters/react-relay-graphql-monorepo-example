import { jwt } from "@repo/jwt-utils";
import { ACCESSSECRET, ACCESS_TOKEN_EXP_NUMBER, IS_PRODUCTION, REFRESHSECRET, REFRESH_TOKEN_EXP_NUMBER } from "@repo/utils";
import { serialize } from "cookie";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import type { Context } from "../types.ts";

type Payload = {
  error: string;
};

export const ExtendSessionMutation = mutationWithClientMutationId({
  name: "ExtendSession",
  description: "Obtén un Refresh Token nuevo.",
  inputFields: {},
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (_: unknown, { rdb, refreshToken, id, res }: Context): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      if (!refreshToken) {
        throw new Error("Do not have Refresh Token");
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) throw new Error("User do not exists");

      const isBlacklisted = await rdb?.get(refreshToken);
      if (isBlacklisted) {
        throw new Error("User is suspended");
      }
      const { isBorrower, isLender, isSupport } = user;
      const now = new Date();
      now.setMilliseconds(0);
      const nowTime = now.getTime() / 1_000;
      const refreshTokenExpireTime = nowTime + REFRESH_TOKEN_EXP_NUMBER;
      const accessTokenExpireTime = nowTime + ACCESS_TOKEN_EXP_NUMBER;
      const newRefreshToken = jwt.sign(
        {
          id,
          isLender,
          isBorrower,
          isSupport,
          refreshTokenExpireTime,
          exp: refreshTokenExpireTime,
        },
        REFRESHSECRET,
      );
      const refreshTokenExpireDate = new Date(refreshTokenExpireTime * 1_000);
      res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", newRefreshToken, {
          httpOnly: true,
          expires: refreshTokenExpireDate,
          secure: true,
          sameSite: IS_PRODUCTION ? "strict" : "none",
          domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
        }),
      );
      const accessToken = jwt.sign(
        {
          id,
          isBorrower,
          isLender,
          isSupport,
          refreshTokenExpireTime,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET,
      );
      res.setHeader("accessToken", accessToken);
      return {
        error: "",
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});

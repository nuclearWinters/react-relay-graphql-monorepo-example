import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { ACCESSSECRET, NODE_ENV, REFRESHSECRET } from "../config";
import {
  ACCESS_TOKEN_EXP_STRING,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { addMinutes, isAfter } from "date-fns";

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
  mutateAndGetPayload: async (
    _: unknown,
    { rdb, refreshToken, id, res, sessionId }: Context
  ): Promise<Payload> => {
    try {
      if (!refreshToken || !id) {
        throw new Error("No hay refreshToken o accessToken.");
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) throw new Error("El usuario no existe.");

      const blacklistedUserTime = await rdb?.get(sessionId);
      if (blacklistedUserTime) {
        const time = new Date(Number(blacklistedUserTime) * 1000);
        const issuedTime = addMinutes(new Date(user.exp * 1000), -3);
        const loggedAfter = isAfter(issuedTime, time);
        if (!loggedAfter) {
          throw new Error("El usuario esta bloqueado.");
        }
      }
      const { isBorrower, isLender, isSupport } = user;
      const now = new Date();
      const expireTime = addMinutes(now, REFRESH_TOKEN_EXP_NUMBER);
      expireTime.setMilliseconds(0);
      now.setMilliseconds(0);
      const refreshTokenExpireTimeInt = expireTime.getTime() / 1000;
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpiresIn = refreshTokenExpireTimeInt - nowTime;
      const newRefreshToken = jwt.sign(
        {
          id,
          isLender,
          isBorrower,
          isSupport,
          refreshTokenExpireTime: refreshTokenExpireTimeInt,
        },
        REFRESHSECRET,
        { expiresIn: refreshTokenExpiresIn }
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        expires: expireTime,
        secure: NODE_ENV === "production" ? true : false,
      });
      const accessToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
          refreshTokenExpireTime: refreshTokenExpireTimeInt,
        },
        ACCESSSECRET,
        { expiresIn: ACCESS_TOKEN_EXP_STRING }
      );
      res?.setHeader("accessToken", accessToken);
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

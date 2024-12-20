import type { AuthUserSessions } from "@repo/mongo-utils";
import { IS_PRODUCTION } from "@repo/utils";
import { serialize } from "cookie";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { ObjectId } from "mongodb";
import { GraphQLSession } from "../AuthUserQuery.ts";
import type { Context } from "../types.ts";

interface Input {
  sessionId: string;
}

type Payload = {
  error: string;
  session: AuthUserSessions | null;
};

export const RevokeSessionMutation = mutationWithClientMutationId({
  name: "RevokeSession",
  description: "Revoca una sesion.",
  inputFields: {
    sessionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    session: {
      type: GraphQLSession,
      resolve: ({ session }: Payload): AuthUserSessions | null => session,
    },
  },
  mutateAndGetPayload: async ({ sessionId }: Input, { rdb, id, sessions, refreshToken, res }: Context): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      const { id: session_id } = fromGlobalId(sessionId);
      const session_oid = new ObjectId(session_id);
      const now = new Date();
      now.setMilliseconds(0);
      const time = now.getTime();
      const session = await sessions.findOneAndUpdate({ _id: session_oid }, { $set: { expirationDate: now } }, { returnDocument: "after" });
      if (session) {
        await rdb.set(session.refreshToken, time, { EX: 60 * 15 });
        if (refreshToken === session.refreshToken) {
          res.setHeader("accessToken", "");
          res.appendHeader(
            "Set-Cookie",
            serialize("refreshToken", "", {
              httpOnly: true,
              expires: now,
              secure: true,
              sameSite: IS_PRODUCTION ? "strict" : "none",
              domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
            }),
          );
        }
      }
      return { error: "", session };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        session: null,
      };
    }
  },
});

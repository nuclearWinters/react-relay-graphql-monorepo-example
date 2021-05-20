import { ObjectID } from "mongodb";
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLString,
} from "graphql";
import {
  BackwardConnectionArgs,
  Connection,
  connectionArgs,
  connectionFromArray,
  ForwardConnectionArgs,
  ConnectionArguments,
} from "graphql-relay";
import { InvestmentConnection } from "./Nodes";
import { Context, InvestmentMongo } from "./types";
import { base64, refreshTokenMiddleware, unbase64 } from "./utils";

interface IQuery {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: GraphQLFieldConfigArgumentMap &
    ForwardConnectionArgs &
    BackwardConnectionArgs;
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<Connection<InvestmentMongo>>;
}

interface Args extends ConnectionArguments {
  user_id?: string | null;
  refreshToken?: string | null;
}

export const QueryInvestments: IQuery = {
  type: new GraphQLNonNull(InvestmentConnection),
  args: {
    user_id: {
      type: GraphQLString,
    },
    refreshToken: {
      type: GraphQLString,
    },
    ...connectionArgs,
  },
  resolve: async (
    _,
    args: Args,
    { investments, accessToken }
  ): Promise<Connection<InvestmentMongo>> => {
    try {
      const { _id } = await refreshTokenMiddleware(
        accessToken,
        args.refreshToken || ""
      );
      if (args.user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const investment_id = unbase64(args.after || "");
      const limit = args.first ? args.first + 1 : 0;
      if (limit <= 0) {
        throw new Error("Se requiere que 'first' sea un entero positivo");
      }
      const result = await (investment_id
        ? investments
            .find({
              _id: { $lt: new ObjectID(investment_id) },
              _id_lender: new ObjectID(_id),
            })
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray()
        : investments
            .find({ _id_lender: new ObjectID(_id) })
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray());
      const edgesMapped = result.map((investment) => {
        return {
          cursor: base64(investment._id.toHexString()),
          node: investment,
        };
      });
      const edges = edgesMapped.slice(0, args.first || 5);
      return {
        edges,
        pageInfo: {
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
          hasPreviousPage: false,
          hasNextPage: edgesMapped.length > (args.first || 0),
        },
      };
    } catch (e) {
      return connectionFromArray([], args);
    }
  },
};

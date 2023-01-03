import { ObjectId } from "bson";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLScalarType,
  Kind,
} from "graphql";
import {
  Connection,
  ConnectionArguments,
  connectionDefinitions,
  connectionFromArray,
  forwardConnectionArgs,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from "graphql-relay";
import { Filter } from "mongodb";
import { Languages } from "./mutations/SignUpMutation";
import { Context, UserLogins, UserMongo, UserSessions } from "./types";
import { base64, unbase64 } from "./utils";

export const DateScalarType = new GraphQLScalarType({
  name: "Date",
  serialize: (value) => {
    if (value instanceof Date) {
      return value.getTime();
    }
  },
  parseValue: (value) => {
    if (typeof value === "number") {
      return new Date(value);
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

const { nodeInterface, nodeField } = nodeDefinitions<Context>(
  async (globalId, { users, sessions, logins, id: userId }) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "AuthUser":
        if (!userId) {
          return {
            _id: new ObjectId("000000000000000000000000"),
            email: "",
            password: "",
            language: "default",
            name: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            RFC: "",
            CURP: "",
            clabe: "",
            mobile: "",
            isBorrower: false,
            isLender: true,
            isSupport: false,
            id: "",
          };
        }
        return { ...(await users.findOne({ _id: new ObjectId(id) })), type };
      case "Session":
        return { ...(await sessions.findOne({ _id: new ObjectId(id) })), type };
      case "Login":
        return {
          ...(await logins.findOne({ _id: new ObjectId(id) })),
          type,
        };
      default:
        return { type: "" };
    }
  },
  (obj: { type: string }) => obj.type
);

export const GraphQLSession = new GraphQLObjectType<UserSessions>({
  name: "Session",
  fields: {
    id: globalIdField("Investment", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    applicationName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ applicationName }): string => applicationName,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ type }): string => type,
    },
    deviceName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ deviceName }): string => deviceName,
    },
    sessionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ sessionId }): string => sessionId,
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ address }): string => address,
    },
    lasTimeAccessed: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ lasTimeAccessed }): Date => lasTimeAccessed,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ userId }): string => userId,
    },
  },
  interfaces: [nodeInterface],
});

const { connectionType: SessionsConnection, edgeType: GraphQLSessionEdge } =
  connectionDefinitions({
    name: "Sessions",
    nodeType: GraphQLSession,
  });

export const GraphQLLogin = new GraphQLObjectType<UserLogins>({
  name: "Login",
  fields: {
    id: globalIdField("Login", ({ _id }): string => _id.toHexString()),
    applicationName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ applicationName }): string => applicationName,
    },
    time: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ time }): Date => time,
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ address }): string => address,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ userId }): string => userId,
    },
  },
  interfaces: [nodeInterface],
});

const { connectionType: LoginConnection, edgeType: GraphQLLoginEdge } =
  connectionDefinitions({
    name: "Logins",
    nodeType: GraphQLLogin,
  });

export const GraphQLAuthUser = new GraphQLObjectType<UserMongo, Context>({
  name: "AuthUser",
  fields: {
    id: globalIdField("AuthUser", ({ _id }): string => _id.toHexString()),
    accountId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }): string => id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ name }): string => name,
    },
    apellidoPaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoPaterno }): string => apellidoPaterno,
    },
    apellidoMaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoMaterno }): string => apellidoMaterno,
    },
    RFC: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ RFC }): string => RFC,
    },
    CURP: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ CURP }): string => CURP,
    },
    clabe: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ clabe }): string => clabe,
    },
    mobile: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ mobile }): string => mobile,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ email }): string => email,
    },
    language: {
      type: new GraphQLNonNull(Languages),
      resolve: ({ language }): "es" | "en" | "default" => language,
    },
    isSupport: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isSupport }): boolean => isSupport,
    },
    isLender: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isLender }): boolean => isLender,
    },
    isBorrower: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isBorrower }): boolean => isBorrower,
    },
    sessions: {
      type: new GraphQLNonNull(SessionsConnection),
      args: forwardConnectionArgs,
      resolve: async (
        _root: unknown,
        args: unknown,
        { sessions, id }: Context
      ): Promise<Connection<UserSessions>> => {
        const { after, first } = args as ConnectionArguments;
        try {
          if (!id) {
            throw new Error("Do not return anything to not registered user");
          }
          const sessions_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<UserSessions> = {
            userId: id,
          };
          if (sessions_id) {
            query._id = { $lt: new ObjectId(sessions_id) };
          }
          const result = await sessions
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((session) => {
            return {
              cursor: base64(session._id.toHexString()),
              node: session,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
    logins: {
      type: new GraphQLNonNull(LoginConnection),
      args: forwardConnectionArgs,
      resolve: async (
        _root: unknown,
        args: unknown,
        { logins, id }: Context
      ): Promise<Connection<UserLogins>> => {
        const { first, after } = args as ConnectionArguments;
        try {
          if (!id) {
            throw new Error("Do not return anything to not registered user");
          }
          const logins_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<UserLogins> = {
            userId: id,
          };
          if (logins_id) {
            query._id = { $lt: new ObjectId(logins_id) };
          }
          const result = await logins
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((login) => {
            return {
              cursor: base64(login._id.toHexString()),
              node: login,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
  },
  interfaces: [nodeInterface],
});

const QueryUser = {
  type: new GraphQLNonNull(GraphQLAuthUser),
  resolve: async (
    _root: unknown,
    _args: unknown,
    { users, id }: Context
  ): Promise<UserMongo> => {
    try {
      const user = await users.findOne({
        id,
      });
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      return user;
    } catch (e) {
      return {
        _id: new ObjectId("000000000000000000000000"),
        email: "",
        password: "",
        language: "default",
        name: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        isBorrower: false,
        isLender: true,
        isSupport: false,
        id: "",
      };
    }
  },
};

export { QueryUser, GraphQLLoginEdge, GraphQLSessionEdge, nodeField };

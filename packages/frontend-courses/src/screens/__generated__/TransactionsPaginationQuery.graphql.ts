/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TransactionsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
  refreshToken: string;
};
export type TransactionsPaginationQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<"Transactions_query">;
};
export type TransactionsPaginationQuery = {
  readonly response: TransactionsPaginationQueryResponse;
  readonly variables: TransactionsPaginationQueryVariables;
};

/*
query TransactionsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: String!
  $refreshToken: String!
) {
  ...Transactions_query_1G22uz
}

fragment Transactions_query_1G22uz on Query {
  transactions(first: $count, after: $cursor, refreshToken: $refreshToken, user_id: $id) {
    edges {
      node {
        id
        count
        history {
          id
          _id_borrower
          _id_loan
          type
          quantity
          created
        }
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: 2,
        kind: "LocalArgument",
        name: "count",
      } as any,
      {
        defaultValue: "",
        kind: "LocalArgument",
        name: "cursor",
      } as any,
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      } as any,
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "refreshToken",
      } as any,
    ],
    v1 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "cursor",
      } as any,
      {
        kind: "Variable",
        name: "first",
        variableName: "count",
      } as any,
      {
        kind: "Variable",
        name: "refreshToken",
        variableName: "refreshToken",
      } as any,
      {
        kind: "Variable",
        name: "user_id",
        variableName: "id",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "TransactionsPaginationQuery",
      selections: [
        {
          args: [
            {
              kind: "Variable",
              name: "count",
              variableName: "count",
            },
            {
              kind: "Variable",
              name: "cursor",
              variableName: "cursor",
            },
          ],
          kind: "FragmentSpread",
          name: "Transactions_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "TransactionsPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "BucketTransactionConnection",
          kind: "LinkedField",
          name: "transactions",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "BucketTransactionEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "BucketTransaction",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "count",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "Transaction",
                      kind: "LinkedField",
                      name: "history",
                      plural: true,
                      selections: [
                        v2 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "_id_borrower",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "_id_loan",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "type",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "quantity",
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "created",
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "__typename",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "cursor",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "PageInfo",
              kind: "LinkedField",
              name: "pageInfo",
              plural: false,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "endCursor",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "hasNextPage",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v1 /*: any*/,
          filters: ["refreshToken", "user_id"],
          handle: "connection",
          key: "Transactions_query_transactions",
          kind: "LinkedHandle",
          name: "transactions",
        },
      ],
    },
    params: {
      cacheID: "6d87446903b6d9ec35681ad68d3e1f97",
      id: null,
      metadata: {},
      name: "TransactionsPaginationQuery",
      operationKind: "query",
      text:
        'query TransactionsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: String!\n  $refreshToken: String!\n) {\n  ...Transactions_query_1G22uz\n}\n\nfragment Transactions_query_1G22uz on Query {\n  transactions(first: $count, after: $cursor, refreshToken: $refreshToken, user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "69f81226e3cf808c3a8a87c5b268f59e";
export default node;

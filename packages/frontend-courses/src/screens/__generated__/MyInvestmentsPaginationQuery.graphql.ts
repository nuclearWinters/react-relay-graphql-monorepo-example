/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InvestmentStatus =
  | "DELAY_PAYMENT"
  | "PAID"
  | "PAST_DUE"
  | "UP_TO_DATE"
  | "%future added value";
export type MyInvestmentsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
  status: Array<InvestmentStatus>;
};
export type MyInvestmentsPaginationQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<"MyInvestments_query">;
};
export type MyInvestmentsPaginationQuery = {
  readonly response: MyInvestmentsPaginationQueryResponse;
  readonly variables: MyInvestmentsPaginationQueryVariables;
};

/*
query MyInvestmentsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: String!
  $status: [InvestmentStatus!]! = [DELAY_PAYMENT, UP_TO_DATE]
) {
  ...MyInvestments_query_4qXjrI
}

fragment InvestmentRow_investment on Investment {
  id
  _id_borrower
  _id_loan
  quantity
  created
  updated
  status
  payments
  ROI
  term
  moratory
}

fragment MyInvestments_query_4qXjrI on Query {
  investments(first: $count, after: $cursor, user_id: $id, status: $status) {
    edges {
      node {
        id
        ...InvestmentRow_investment
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
        defaultValue: ["DELAY_PAYMENT", "UP_TO_DATE"],
        kind: "LocalArgument",
        name: "status",
      } as any,
    ],
    v1 = {
      kind: "Variable",
      name: "status",
      variableName: "status",
    } as any,
    v2 = [
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
      v1 /*: any*/,
      {
        kind: "Variable",
        name: "user_id",
        variableName: "id",
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "MyInvestmentsPaginationQuery",
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
            v1 /*: any*/,
          ],
          kind: "FragmentSpread",
          name: "MyInvestments_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "MyInvestmentsPaginationQuery",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "InvestmentsConnection",
          kind: "LinkedField",
          name: "investments",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "InvestmentsEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Investment",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "id",
                      storageKey: null,
                    },
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
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "updated",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "status",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "payments",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "ROI",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "term",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "moratory",
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
          args: v2 /*: any*/,
          filters: ["user_id", "status"],
          handle: "connection",
          key: "MyInvestments_query_investments",
          kind: "LinkedHandle",
          name: "investments",
        },
      ],
    },
    params: {
      cacheID: "261dbf834866439ac67390c11098f911",
      id: null,
      metadata: {},
      name: "MyInvestmentsPaginationQuery",
      operationKind: "query",
      text: 'query MyInvestmentsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: String!\n  $status: [InvestmentStatus!]! = [DELAY_PAYMENT, UP_TO_DATE]\n) {\n  ...MyInvestments_query_4qXjrI\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n}\n\nfragment MyInvestments_query_4qXjrI on Query {\n  investments(first: $count, after: $cursor, user_id: $id, status: $status) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "d5d035c6f594f401bce142fa5b3e0dfa";
export default node;

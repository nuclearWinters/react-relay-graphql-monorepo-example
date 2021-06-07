/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InvestmentRowRefetchQueryVariables = {
  id: string;
};
export type InvestmentRowRefetchQueryResponse = {
  readonly node: {
    readonly " $fragmentRefs": FragmentRefs<"InvestmentRow_investment">;
  } | null;
};
export type InvestmentRowRefetchQuery = {
  readonly response: InvestmentRowRefetchQueryResponse;
  readonly variables: InvestmentRowRefetchQueryVariables;
};

/*
query InvestmentRowRefetchQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ...InvestmentRow_investment
    id
  }
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
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      } as any,
    ],
    v1 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "InvestmentRowRefetchQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
          selections: [
            {
              args: null,
              kind: "FragmentSpread",
              name: "InvestmentRow_investment",
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "InvestmentRowRefetchQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "__typename",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "id",
              storageKey: null,
            },
            {
              kind: "InlineFragment",
              selections: [
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
              ],
              type: "Investment",
              abstractKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "3e7d5023ecda9838ecb9f24dcdaaf71f",
      id: null,
      metadata: {},
      name: "InvestmentRowRefetchQuery",
      operationKind: "query",
      text: "query InvestmentRowRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...InvestmentRow_investment\n    id\n  }\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n}\n",
    },
  } as any;
})();
(node as any).hash = "3e1cac86e549c2f4e368fcae142c5584";
export default node;

/**
 * @generated SignedSource<<03e73cd0ac1411437ba2c60e8b1132f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @dataDrivenDependency MyTransactionsQueries_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsQueries_user$data = {
  readonly id: string;
  readonly transactions: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly __fragmentPropName?: string | null | undefined;
        readonly __id: string;
        readonly __module_component?: string | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"InvestmentTransaction_transaction" | "MoneyTransaction_transaction">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "MyTransactionsQueries_user";
};
export type MyTransactionsQueries_user$key = {
  readonly " $data"?: MyTransactionsQueries_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyTransactionsQueries_user">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "transactions"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 5,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": "",
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./MyTransactionsPaginationUser.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MyTransactionsQueries_user",
  "selections": [
    {
      "alias": "transactions",
      "args": null,
      "concreteType": "TransactionConnection",
      "kind": "LinkedField",
      "name": "__MyTransactions_user_transactions_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TransactionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "documentName": "MyTransactionsQueries_user",
                      "fragmentName": "InvestmentTransaction_transaction",
                      "fragmentPropName": "transaction",
                      "kind": "ModuleImport"
                    }
                  ],
                  "type": "InvestTransaction",
                  "abstractKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "documentName": "MyTransactionsQueries_user",
                      "fragmentName": "MoneyTransaction_transaction",
                      "fragmentPropName": "transaction",
                      "kind": "ModuleImport"
                    }
                  ],
                  "type": "MoneyTransaction",
                  "abstractKey": null
                },
                {
                  "kind": "ClientExtension",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "__id",
                      "storageKey": null
                    }
                  ]
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
})();

(node as any).hash = "cbbcd437936991af82124464545d12c2";

export default node;

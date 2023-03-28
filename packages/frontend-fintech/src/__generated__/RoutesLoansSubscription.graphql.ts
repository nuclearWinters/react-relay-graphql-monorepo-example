/**
 * @generated SignedSource<<0174755cb190608f82a4606a2f36eb54>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type RoutesLoansSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type RoutesLoansSubscription$data = {
  readonly loans_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
      readonly ROI: number;
      readonly expiry: Int;
      readonly goal: string;
      readonly id: string;
      readonly id_user: string;
      readonly pending: string;
      readonly pendingCents: number;
      readonly raised: string;
      readonly scheduledPayments: ReadonlyArray<{
        readonly amortize: string;
        readonly scheduledDate: Int;
        readonly status: LoanScheduledPaymentStatus;
      }> | null;
      readonly score: string;
      readonly status: LoanStatus;
      readonly term: number;
    } | null;
  };
};
export type RoutesLoansSubscription = {
  response: RoutesLoansSubscription$data;
  variables: RoutesLoansSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "LoanEdge",
  "kind": "LinkedField",
  "name": "loans_subscribe_insert",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Loan",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id_user",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "score",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "ROI",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "goal",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "term",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "raised",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expiry",
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "ScheduledPayments",
          "kind": "LinkedField",
          "name": "scheduledPayments",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "amortize",
              "storageKey": null
            },
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "scheduledDate",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pending",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pendingCents",
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesLoansSubscription",
    "selections": [
      (v2/*: any*/)
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesLoansSubscription",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "prependEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "loans_subscribe_insert",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ac4081f69797db81f3c69a13a61d739d",
    "id": null,
    "metadata": {},
    "name": "RoutesLoansSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesLoansSubscription {\n  loans_subscribe_insert {\n    node {\n      id\n      id_user\n      score\n      ROI\n      goal\n      term\n      raised\n      expiry\n      status\n      scheduledPayments {\n        amortize\n        status\n        scheduledDate\n      }\n      pending\n      pendingCents\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "988b412628f3af4803bd8efcaee208be";

export default node;
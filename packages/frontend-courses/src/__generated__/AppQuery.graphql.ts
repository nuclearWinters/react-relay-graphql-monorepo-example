/**
 * @generated SignedSource<<a0b211f760b4a657b33601607605e657>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AppQuery$variables = {};
export type AppQuery$data = {
  readonly authUser: {
    readonly " $fragmentSpreads": FragmentRefs<"Routes_auth_user">;
  };
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"Routes_user">;
  };
};
export type AppQuery = {
  response: AppQuery$data;
  variables: AppQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountId",
  "storageKey": null
},
v2 = {
  "kind": "Literal",
  "name": "after",
  "value": ""
},
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 5
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/),
  {
    "kind": "Literal",
    "name": "firstFetch",
    "value": true
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_user",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_borrower",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "_id_loan",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v12 = {
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
},
v13 = [
  (v2/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 2
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": [
      "DELAY_PAYMENT",
      "UP_TO_DATE",
      "FINANCING"
    ]
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ROI",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "term",
  "storageKey": null
},
v17 = [
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Routes_user"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Routes_auth_user"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountAvailable",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountTotal",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountToBePaid",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "TransactionConnection",
            "kind": "LinkedField",
            "name": "transactions",
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
                    "concreteType": "Transaction",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      },
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": "transactions(after:\"\",first:5,firstFetch:true)"
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "filters": [
              "firstFetch"
            ],
            "handle": "connection",
            "key": "MyTransactions_user_transactions",
            "kind": "LinkedHandle",
            "name": "transactions"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "concreteType": "InvestmentsConnection",
            "kind": "LinkedField",
            "name": "investments",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "InvestmentsEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Investment",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "updated",
                        "storageKey": null
                      },
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "payments",
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      (v16/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "moratory",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "interest_to_earn",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "paid_already",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "to_be_paid",
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": "investments(after:\"\",first:2,status:[\"DELAY_PAYMENT\",\"UP_TO_DATE\",\"FINANCING\"])"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "filters": [
              "status"
            ],
            "handle": "connection",
            "key": "MyInvestments_user_investments",
            "kind": "LinkedHandle",
            "name": "investments"
          },
          {
            "kind": "ClientExtension",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "statusLocal",
                "storageKey": null
              }
            ]
          },
          {
            "alias": null,
            "args": (v17/*: any*/),
            "concreteType": "LoanConnection",
            "kind": "LinkedField",
            "name": "loans",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LoanEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Loan",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "score",
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "goal",
                        "storageKey": null
                      },
                      (v16/*: any*/),
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
                      (v14/*: any*/),
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
                          (v14/*: any*/),
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
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": "loans(after:\"\",first:5)"
          },
          {
            "alias": null,
            "args": (v17/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "AddInvestments_user_loans",
            "kind": "LinkedHandle",
            "name": "loans"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoPaterno",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoMaterno",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "language",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isBorrower",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isSupport",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "RFC",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "CURP",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clabe",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mobile",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isLender",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e6c7c536c05821352ffeb7b80fad4b8f",
    "id": null,
    "metadata": {},
    "name": "AppQuery",
    "operationKind": "query",
    "text": "query AppQuery {\n  user {\n    ...Routes_user\n    id\n  }\n  authUser {\n    ...Routes_auth_user\n    id\n  }\n}\n\nfragment Account_user on User {\n  accountAvailable\n  accountToBePaid\n  accountTotal\n}\n\nfragment AddInvestments_auth_user on AuthUser {\n  isLender\n  isSupport\n  isBorrower\n  language\n  accountId\n}\n\nfragment AddInvestments_user on User {\n  loans(first: 5, after: \"\") {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n  interest_to_earn\n  paid_already\n  to_be_paid\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n  pending\n  pendingCents\n}\n\nfragment MyInvestments_user on User {\n  id\n  investments(first: 2, after: \"\", status: [DELAY_PAYMENT, UP_TO_DATE, FINANCING]) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment MyTransactions_auth_user on AuthUser {\n  language\n}\n\nfragment MyTransactions_user on User {\n  transactions(first: 5, after: \"\", firstFetch: true) {\n    edges {\n      node {\n        id\n        id_user\n        id_borrower\n        _id_loan\n        type\n        quantity\n        created\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n\nfragment Routes_auth_user on AuthUser {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  language\n  isBorrower\n  isSupport\n  ...Settings_auth_user\n  ...AddInvestments_auth_user\n  ...MyTransactions_auth_user\n}\n\nfragment Routes_user on User {\n  id\n  accountAvailable\n  accountTotal\n  accountId\n  ...Account_user\n  ...MyTransactions_user\n  ...MyInvestments_user\n  ...AddInvestments_user\n}\n\nfragment Settings_auth_user on AuthUser {\n  id\n  accountId\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  email\n  language\n}\n"
  }
};
})();

(node as any).hash = "d4ae24c85ac1d86f8f0e302f461e2904";

export default node;

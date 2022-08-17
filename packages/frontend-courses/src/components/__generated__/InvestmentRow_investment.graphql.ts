/**
 * @generated SignedSource<<b6196f2ad339083bc43c54a152d542d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InvestmentRow_investment$data = {
  readonly ROI: number;
  readonly _id_loan: string;
  readonly created: Int;
  readonly id: string;
  readonly id_borrower: string;
  readonly interest_to_earn: string;
  readonly moratory: string;
  readonly paid_already: string;
  readonly payments: number;
  readonly quantity: string;
  readonly status: InvestmentStatus;
  readonly still_invested: string;
  readonly term: number;
  readonly updated: Int;
  readonly " $fragmentType": "InvestmentRow_investment";
};
export type InvestmentRow_investment$key = {
  readonly " $data"?: InvestmentRow_investment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InvestmentRow_investment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./InvestmentRowRefetchQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "InvestmentRow_investment",
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
      "name": "id_borrower",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "_id_loan",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "quantity",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "created",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "updated",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "payments",
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
      "name": "term",
      "storageKey": null
    },
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
      "name": "still_invested",
      "storageKey": null
    }
  ],
  "type": "Investment",
  "abstractKey": null
};

(node as any).hash = "2c9377ed917485504d3cbceaae446a7c";

export default node;

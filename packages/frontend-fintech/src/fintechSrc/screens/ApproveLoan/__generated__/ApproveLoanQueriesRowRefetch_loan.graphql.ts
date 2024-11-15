/**
 * @generated SignedSource<<8859b8675b887dc86d95e50e8d9ed9ce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ApproveLoanQueriesRowRefetch_loan$data = {
  readonly ROI: number;
  readonly expiry: Int;
  readonly goal: string;
  readonly id: string;
  readonly pending: string;
  readonly raised: string;
  readonly score: string;
  readonly status: LoanStatus;
  readonly term: number;
  readonly user_id: string;
  readonly " $fragmentType": "ApproveLoanQueriesRowRefetch_loan";
};
export type ApproveLoanQueriesRowRefetch_loan$key = {
  readonly " $data"?: ApproveLoanQueriesRowRefetch_loan$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApproveLoanQueriesRowRefetch_loan">;
};

import ApproveLoanQueriesRefetchQuery_graphql from './ApproveLoanQueriesRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": ApproveLoanQueriesRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "ApproveLoanQueriesRowRefetch_loan",
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
      "name": "user_id",
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
      "name": "pending",
      "storageKey": null
    }
  ],
  "type": "Loan",
  "abstractKey": null
};

(node as any).hash = "eb54b2dbb84e6e6c89aa624e181984bf";

export default node;

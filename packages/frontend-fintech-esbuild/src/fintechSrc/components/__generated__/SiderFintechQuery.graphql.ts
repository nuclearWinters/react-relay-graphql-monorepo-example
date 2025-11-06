/**
 * @generated SignedSource<<13bd2cde0e7436275136bf3155bc6c76>>
 * @relayHash 169690785875e78760a32cfd1849293d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 169690785875e78760a32cfd1849293d

import { ConcreteRequest } from 'relay-runtime';
export type SiderFintechQuery$variables = Record<PropertyKey, never>;
export type SiderFintechQuery$data = {
  readonly user: {
    readonly accountAvailable: string;
    readonly accountTotal: string;
  } | null | undefined;
};
export type SiderFintechQuery = {
  response: SiderFintechQuery$data;
  variables: SiderFintechQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountAvailable",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountTotal",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SiderFintechQuery",
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
          (v1/*: any*/)
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
    "name": "SiderFintechQuery",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "169690785875e78760a32cfd1849293d",
    "metadata": {},
    "name": "SiderFintechQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "24b41426c29acb9b06c098e82ab46dfc";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;

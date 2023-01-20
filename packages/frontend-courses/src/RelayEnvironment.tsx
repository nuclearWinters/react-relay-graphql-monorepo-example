import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  Observable,
  GraphQLResponse,
} from "relay-runtime";
import { tokensAndData } from "App";
import { API_GATEWAY, REALTIME_GATEWAY } from "utils";
import { createClient, Sink } from "graphql-ws";
import jwtDecode from "jwt-decode";

export const subscriptionsClient = createClient({
  url: REALTIME_GATEWAY,
  connectionParams: () => {
    return {
      Authorization: tokensAndData.accessToken,
    };
  },
});

const fetchRelay = async (params: RequestParameters, variables: Variables) => {
  const response = await fetch(API_GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokensAndData.accessToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: params?.text || "",
      variables,
    }),
  });
  const data = await response.json();
  const accesstoken = response.headers.get("accessToken");
  if (tokensAndData.accessToken !== accesstoken) {
    tokensAndData.accessToken = accesstoken || "";
    if (accesstoken) {
      const decoded = jwtDecode<{ refreshTokenExpireTime: number }>(
        accesstoken
      );
      tokensAndData.exp = decoded.refreshTokenExpireTime;
    }
  }

  if (tokensAndData.accessToken && !accesstoken) {
    return window.location.reload();
  }

  if (Array.isArray(data?.extensions?.modules)) {
    registerModuleLoaders(data.extensions.modules);
  }

  return data;
};

const subscribeRelay = (operation: RequestParameters, variables: Variables) => {
  return Observable.create<GraphQLResponse>((sink) => {
    if (!operation.text) {
      return sink.error(new Error("Operation text cannot be empty"));
    }
    return subscriptionsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink as Sink
    );
  });
};

const network = Network.create(fetchRelay, subscribeRelay);

const operationLoader = {
  get: (name: string) => {
    return moduleLoader(name).get();
  },
  load: (name: string) => {
    return moduleLoader(name).load();
  },
};

const RelayEnvironment = new Environment({
  network: network,
  store: new Store(new RecordSource(), { operationLoader }),
  operationLoader,
  isServer: false,
});

function registerModuleLoaders(modules: string[]) {
  modules.forEach((module) => {
    if (module.endsWith("$normalization.graphql")) {
      registerLoader(
        module,
        () => import(`./components/__generated__/${module}`)
      );
    } else {
      registerLoader(module, () => import(`./components/${module}`));
    }
  });
}

const loaders = new Map();
const loadedModules = new Map();
const failedModules = new Map();
const pendingLoaders = new Map();

export default function moduleLoader(name: string) {
  return {
    getError() {
      return failedModules.get(name);
    },
    resetError() {
      failedModules.delete(name);
    },
    get() {
      const module = loadedModules.get(name);
      return module == null ? null : module.default;
    },
    load() {
      const loader = loaders.get(name);
      if (loader == null) {
        const promise = new Promise((resolve, reject) => {
          loaders.set(name, {
            kind: "pending",
            resolve,
            reject,
          });
        });
        pendingLoaders.set(name, promise);
        return promise;
      } else if (loader.kind === "registered") {
        return loader.loaderFn().then(
          (module: any) => {
            loadedModules.set(name, module);
            return module.default;
          },
          (error: Error) => {
            failedModules.set(name, error);
            throw error;
          }
        );
      } else if (loader.kind === "pending") {
        return pendingLoaders.get(name);
      }
    },
  };
}

export function registerLoader(name: string, loaderFn: any) {
  const loader = loaders.get(name);
  if (loader == null) {
    loaders.set(name, {
      kind: "registered",
      loaderFn,
    });
  } else if (loader.kind === "pending") {
    loaderFn().then(
      (module: any) => {
        loadedModules.set(name, module);
        pendingLoaders.delete(name);
        loader.resolve(module.default);
      },
      (error: Error) => {
        failedModules.set(name, error);
        pendingLoaders.delete(name);
        loader.reject(error);
      }
    );
  }
}

export { RelayEnvironment };

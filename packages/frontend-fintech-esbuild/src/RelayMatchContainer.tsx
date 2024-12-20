//@ts-expect-error this component is not typed yet
import MatchContainer from "react-relay/lib/relay-hooks/MatchContainer";
import ErrorBoundary from "./ErrorBoundary";
import moduleLoader from "./RelayEnvironment";

export default function RelayMatchContainer({ match }: { match: unknown }) {
  return (
    <ErrorBoundary
      shouldCatchError={(error) => error instanceof ModuleLoaderError}
      renderError={(error, resetError) => {
        return (
          <div className="bg-red-200 rounded-md px-2 py-1 inline-block">
            Failed to load {error.moduleLoaderName}{" "}
            <button
              type="button"
              onClick={() => {
                moduleLoader(error.moduleLoaderName).resetError();
                resetError();
              }}
            >
              Reload
            </button>
          </div>
        );
      }}
    >
      <MatchContainer
        match={match}
        loader={(name: string) => {
          const loader = moduleLoader(name);
          const error = loader.getError();
          if (error) {
            throw new ModuleLoaderError(name as string, error);
          }
          const module = loader.get();
          if (module != null) {
            return module;
          }
          throw loader.load();
        }}
      />
    </ErrorBoundary>
  );
}

export class ModuleLoaderError extends Error {
  constructor(moduleLoaderName: string, error: Error) {
    super(`ModuleLoaderError: ${error.message}`);
    this.moduleLoaderName = moduleLoaderName;
    this.error = error;
  }
  moduleLoaderName: string;
  error: Error;
}

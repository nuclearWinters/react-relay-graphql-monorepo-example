import * as stylex from "@stylexjs/stylex";
import { type FC, Suspense, useMemo, useState } from "react";
import {
  type PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import {
  ConnectionHandler,
  type GraphQLSubscriptionConfig,
} from "relay-runtime";
import { baseApp } from "../../../App";
import RelayMatchContainer from "../../../RelayMatchContainer";
import { Columns, baseColumn } from "../../../components/Colums";
import { CustomButton } from "../../../components/CustomButton";
import { Main } from "../../../components/Main";
import { Rows, baseRows } from "../../../components/Rows";
import { Space, customSpace } from "../../../components/Space";
import { Spinner } from "../../../components/Spinner";
import { Title } from "../../../components/Title";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { useTranslation } from "../../../utils";
import {
  subscriptionTransactions,
  transactionsFragment,
  transactionsPaginationFragment,
} from "./MyTransactionsQueries";
import type { MyTransactionsQueriesPaginationUser } from "./__generated__/MyTransactionsQueriesPaginationUser.graphql";
import type { MyTransactionsQueriesQuery } from "./__generated__/MyTransactionsQueriesQuery.graphql";
import type { MyTransactionsQueriesSubscription } from "./__generated__/MyTransactionsQueriesSubscription.graphql";
import type { MyTransactionsQueries_user$key } from "./__generated__/MyTransactionsQueries_user.graphql";

interface Props {
  fintechQuery: PreloadedQuery<MyTransactionsQueriesQuery>;
}

export const MyTransactionsPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(() => Date.now());
  const { user } = usePreloadedQuery(transactionsFragment, props.fintechQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsQueriesPaginationUser,
    MyTransactionsQueries_user$key
  >(transactionsPaginationFragment, user);

  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "MyTransactionsQueries_user_transactions",
    {
      reset,
    }
  );

  const configTransactions = useMemo<
    GraphQLSubscriptionConfig<MyTransactionsQueriesSubscription>
  >(
    () => ({
      variables: { connections: [connectionTransactionID], reset },
      subscription: subscriptionTransactions,
    }),
    [connectionTransactionID, reset]
  );
  useSubscription<MyTransactionsQueriesSubscription>(configTransactions);

  if (!user) {
    return null;
  }

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Mis movimientos")} />
        <Rows styleX={[baseRows.base, baseRows.transactions]}>
          <Suspense
            fallback={
              <div {...stylex.props(baseApp.base)}>
                <Spinner />
              </div>
            }
          >
            {data?.transactions?.edges?.map((edge) => {
              if (edge?.node) {
                return (
                  <RelayMatchContainer key={edge.node.__id} match={edge.node} />
                );
              }
              return null;
            })}
          </Suspense>
        </Rows>
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton
            text={t("Cargar más")}
            color="secondary"
            onClick={() => loadNext(5)}
          />
          <Space styleX={customSpace.w20} />
          <CustomButton
            text={t("Reiniciar lista")}
            color="secondary"
            onClick={() => {
              const time = Date.now();
              setReset(time);
              refetch(
                {
                  count: 5,
                  cursor: "",
                  reset: time,
                },
                {
                  fetchPolicy: "network-only",
                }
              );
            }}
          />
        </Columns>
        <Space styleX={customSpace.h20} />
      </WrapperSmall>
    </Main>
  );
};

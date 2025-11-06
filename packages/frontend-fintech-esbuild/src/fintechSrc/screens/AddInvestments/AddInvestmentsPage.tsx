import * as stylex from "@stylexjs/stylex";
import {
  Dispatch,
  type FC,
  Fragment,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  ConnectionHandler,
  type PreloadedQuery,
  graphql,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
  useRefetchableFragment,
  useSubscription,
} from "react-relay/hooks";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import FaClipboard from "../../../assets/clipboard-solid.svg";
import FaSyncAlt from "../../../assets/rotate-solid.svg";
import { Columns, baseColumn } from "../../../components/Colums";
import { CustomButton } from "../../../components/CustomButton";
import { Main } from "../../../components/Main";
import { Rows, baseRows } from "../../../components/Rows";
import { Space, customSpace } from "../../../components/Space";
import { Spinner } from "../../../components/Spinner";
import { Table } from "../../../components/Table";
import { TableColumnName } from "../../../components/TableColumnName";
import { Title } from "../../../components/Title";
import { WrapperBig } from "../../../components/WrapperBig";
import { dayDiff, monthDiff, useTranslation } from "../../../utils";
import {
  addInvestmentFragment,
  addInvestmentPaginationFragment,
  addInvestmentsQueriesRowRefetchableFragment,
  subscriptionAddInvestmentsUpdate,
  subscriptionLoans,
} from "./AddInvestmentsQueries";
import type { AddInvestmentQueriesRefetchQuery } from "./__generated__/AddInvestmentQueriesRefetchQuery.graphql";
import type { AddInvestmentsPageMutation } from "./__generated__/AddInvestmentsPageMutation.graphql";
import type { AddInvestmentsQueriesLoansSubscription } from "./__generated__/AddInvestmentsQueriesLoansSubscription.graphql";
import type { AddInvestmentsQueriesPaginationQuery } from "./__generated__/AddInvestmentsQueriesPaginationQuery.graphql";
import type { AddInvestmentsQueriesQuery } from "./__generated__/AddInvestmentsQueriesQuery.graphql";
import type { AddInvestmentsQueriesRowRefetch_loan$key } from "./__generated__/AddInvestmentsQueriesRowRefetch_loan.graphql";
import type { AddInvestmentsQueriesUpdateSubscription } from "./__generated__/AddInvestmentsQueriesUpdateSubscription.graphql";
import type { AddInvestmentsQueries_user$key } from "./__generated__/AddInvestmentsQueries_user.graphql";

const baseAddInvestmentsTotal = stylex.create({
  base: {
    marginTop: "14px",
    fontWeight: "bold",
  },
});

const basePrestarWrapper = stylex.create({
  base: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px",
    padding: "30px 0px",
  },
});

const baseLoanRowIcon = stylex.create({
  base: {
    height: "1rem",
    color: "rgb(255,90,96)",
    margin: "auto",
  },
});

const baseLoanRowCell = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    minWidth: "100px",
  },
});

const baseLoanRowInputBox = stylex.create({
  base: {
    backgroundColor: "white",
    alignItems: "center",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    height: "50px",
  },
});

const baseLoanRowInput = stylex.create({
  base: {
    margin: "4px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#999",
    borderRadius: "4px",
    padding: "4px",
    width: "100%",
    minWidth: "100px",
  },
});

const baseLoanRowClipboard = stylex.create({
  base: {
    display: "table-cell",
    color: "#333",
    cursor: "pointer",
    textAlign: "center",
    minWidth: "60px",
  },
});

const baseLoanRowScore = stylex.create({
  base: {
    color: "#333",
    display: "table-cell",
    minWidth: "80px",
  },
});

const baseLoanRowScoreCircle = stylex.create({
  base: {
    borderRadius: "100%",
    backgroundColor: "rgb(102,141,78)",
    width: "30px",
    height: "30px",
    fontSize: "0.625rem",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
});

const baseLoanRowContainer = stylex.create({
  base: {
    height: "50px",
    backgroundColor: "white",
  },
});

interface Props {
  fintechQuery: PreloadedQuery<
    AddInvestmentsQueriesQuery,
    Record<string, unknown>
  >;
}

interface ILends {
  loan_gid: string;
  quantity: string;
  borrower_id: string;
  goal: string;
  ROI: number;
  term: number;
}

const Cell: FC<{ id: string }> = ({ id }) => {
  const configLoansUpdate = useMemo<
    GraphQLSubscriptionConfig<AddInvestmentsQueriesUpdateSubscription>
  >(
    () => ({
      variables: {
        gid: id,
      },
      subscription: subscriptionAddInvestmentsUpdate,
    }),
    [id]
  );

  useSubscription<AddInvestmentsQueriesUpdateSubscription>(configLoansUpdate);

  return (
    <td {...stylex.props(baseLoanRowClipboard.base)}>
      <FaClipboard
        onClick={() => {
          navigator.clipboard.writeText(id);
        }}
        {...stylex.props(baseLoanRowIcon.base)}
      />
    </td>
  );
};

const RefetchCell: FC<{ loan: AddInvestmentsQueriesRowRefetch_loan$key }> = ({
  loan,
}) => {
  const [, refetch] = useRefetchableFragment<
    AddInvestmentQueriesRefetchQuery,
    AddInvestmentsQueriesRowRefetch_loan$key
  >(addInvestmentsQueriesRowRefetchableFragment, loan);
  return (
    <td
      {...stylex.props(baseLoanRowClipboard.base)}
      onClick={() => {
        refetch({}, { fetchPolicy: "network-only" });
      }}
    >
      <FaSyncAlt {...stylex.props(baseLoanRowIcon.base)} />
    </td>
  );
};

const columnAddInvestment: {
  id: string;
  header: (t: (text: string) => string) => ReactElement;
  cell: (info: {
    info: {
      id: string;
      user_id: string;
      score: string;
      ROI: number;
      goal: string;
      term: number;
      pending: string;
      expiry: number;
      pendingCents: number;
    };
    value: string;
    setLends: Dispatch<SetStateAction<ILends[]>>;
    t: (text: string) => string;
    loan: AddInvestmentsQueriesRowRefetch_loan$key;
  }) => ReactElement;
}[] = [
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => <Cell id={info.id} />,
  },
  {
    id: "user_id",
    header: (t) => <TableColumnName>{t("Solicitante")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.id);
          }}
          {...stylex.props(baseLoanRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "score",
    header: (t) => <TableColumnName>{t("Calif.")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowScore.base)}>
        <div {...stylex.props(baseLoanRowScoreCircle.base)}>{info.score}</div>
      </td>
    ),
  },
  {
    id: "ROI",
    header: (t) => <TableColumnName>{t("Retorno anual")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.ROI}%</td>
    ),
  },
  {
    id: "goal",
    header: (t) => <TableColumnName>{t("Monto")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.goal}</td>
    ),
  },
  {
    id: "term",
    header: (t) => <TableColumnName>{t("Periodo")}</TableColumnName>,
    cell: ({ info, t }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>
        {info.term} {t("meses")}
      </td>
    ),
  },
  {
    id: "pending",
    header: (t) => <TableColumnName>{t("Faltan")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.pending}</td>
    ),
  },
  {
    id: "expiry",
    header: (t) => <TableColumnName>{t("Termina")}</TableColumnName>,
    cell: ({ info, t }) => {
      const now = new Date();
      const expiry = new Date(info.expiry);
      const months = monthDiff(now, expiry);
      const days = dayDiff(now, expiry);
      return (
        <td {...stylex.props(baseLoanRowCell.base)}>
          {months || days} {months ? t("meses") : t("días")}
        </td>
      );
    },
  },
  {
    id: "prestar",
    header: (t) => <TableColumnName>{t("Prestar")}</TableColumnName>,
    cell: ({ info, value, setLends }) => (
      <td {...stylex.props(baseLoanRowInputBox.base)}>
        $
        <input
          type="text"
          name={info.id}
          {...stylex.props(baseLoanRowInput.base)}
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace("e", "");
            if (Number.isNaN(Number(val))) {
              return;
            }
            setLends((state) => {
              const idx = state.findIndex((lend) => info.id === lend.loan_gid);
              if (Number(val) === 0) {
                state.splice(idx, 1);
                return [...state];
              }
              if (idx === -1) {
                return [
                  ...state,
                  {
                    loan_gid: info.id,
                    quantity: val,
                    borrower_id: info.user_id,
                    goal: info.goal,
                    term: info.term,
                    ROI: info.ROI,
                  },
                ];
              }
              const pendingDollars = info.pendingCents / 100;
              const quantity = Number(val);
              if (Number(quantity) > pendingDollars) {
                state[idx].quantity = String(pendingDollars);
              } else {
                state[idx].quantity = val;
              }
              return [...state];
            });
          }}
          onBlur={() => {
            setLends((state) => {
              const idx = state.findIndex((lend) => info.id === lend.loan_gid);
              if (idx === -1) {
                return state;
              }
              state[idx].quantity = Number(state[idx].quantity).toFixed(2);
              return [...state];
            });
          }}
        />
      </td>
    ),
  },
  {
    id: "refetch",
    header: (t) => <TableColumnName>{t("Refrescar")}</TableColumnName>,
    cell: ({ loan }) => <RefetchCell loan={loan} />,
  },
];

export const AddInvestmentsPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const { user } = usePreloadedQuery(addInvestmentFragment, props.fintechQuery);
  const [commit, isInFlight] = useMutation<AddInvestmentsPageMutation>(graphql`
    mutation AddInvestmentsPageMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
      }
    }
  `);
  const { data, loadNext, refetch } = usePaginationFragment<
    AddInvestmentsQueriesPaginationQuery,
    AddInvestmentsQueries_user$key
  >(addInvestmentPaginationFragment, user);

  const [lends, setLends] = useState<ILends[]>([]);

  const getValue = (id: string) => {
    const lend = lends.find((lend) => id === lend.loan_gid);
    if (!lend) {
      return "";
    }
    return lend.quantity;
  };

  const total = lends.reduce((acc, item) => {
    return acc + Number(item.quantity);
  }, 0);

  const connectionLoanID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "AddInvestmentsQueries_query_loansFinancing",
    {
      reset,
    }
  );

  const configLoans = useMemo<
    GraphQLSubscriptionConfig<AddInvestmentsQueriesLoansSubscription>
  >(
    () => ({
      variables: {
        reset,
        connections: [connectionLoanID],
      },
      subscription: subscriptionLoans,
    }),
    [connectionLoanID, reset]
  );

  useSubscription<AddInvestmentsQueriesLoansSubscription>(configLoans);

  if (!user) {
    return null;
  }

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <thead>
            <tr>
              {columnAddInvestment.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.loansFinancing?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const value = getValue(node.id);
              const {
                id,
                user_id,
                score,
                ROI,
                goal,
                term,
                expiry,
                pending,
                pendingCents,
              } = node;
              return (
                <tr key={id} {...stylex.props(baseLoanRowContainer.base)}>
                  {columnAddInvestment.map((column) => (
                    <Fragment key={column.id}>
                      {column.cell({
                        info: {
                          id,
                          user_id,
                          score,
                          ROI,
                          goal,
                          term,
                          expiry,
                          pending,
                          pendingCents,
                        },
                        value,
                        setLends,
                        t,
                        loan: node,
                      })}
                    </Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Rows styleX={[baseRows.base, baseRows.lender]}>
          {isInFlight ? (
            <Spinner />
          ) : (
            <div {...stylex.props(basePrestarWrapper.base)}>
              <Space styleX={customSpace.h30} />
              <CustomButton
                text={t("Prestar")}
                onClick={() => {
                  commit({
                    variables: {
                      input: {
                        lends: lends.map((lend) => ({
                          loan_gid: lend.loan_gid,
                          quantity: lend.quantity,
                        })),
                      },
                    },
                  });
                  setLends([]);
                }}
              />
              <div {...stylex.props(baseAddInvestmentsTotal.base)}>
                {t("Total")}
                {`: $${total}`}
              </div>
              <div {...stylex.props(baseAddInvestmentsTotal.base)}>
                {t("Inversiones")}: {lends.length}
              </div>
              <Space styleX={customSpace.h30} />
            </div>
          )}
        </Rows>
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton
            color="secondary"
            text={t("Cargar más")}
            onClick={() => loadNext(5)}
          />
          <Space styleX={customSpace.w20} />
          <CustomButton
            text={t("Reiniciar lista")}
            color="secondary"
            onClick={() => {
              const time = new Date().getTime();
              setReset(time);
              refetch(
                {
                  count: 5,
                  cursor: "",
                  reset: time,
                },
                { fetchPolicy: "network-only" }
              );
            }}
          />
        </Columns>
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

import * as stylex from "@stylexjs/stylex";
import { type Dispatch, type FC, Fragment, ReactElement, SetStateAction, useMemo, useState } from "react";
import { type PreloadedQuery, usePaginationFragment, usePreloadedQuery, useRefetchableFragment, useSubscription } from "react-relay/hooks";
import { ConnectionHandler, type GraphQLSubscriptionConfig } from "relay-runtime";
import FaClipboard from "../../../assets/clipboard-solid.svg";
import FaSyncAlt from "../../../assets/rotate-solid.svg";
import FaPlusSquare from "../../../assets/square-plus-solid.svg";
import { Columns, baseColumn } from "../../../components/Colums";
import { CustomButton } from "../../../components/CustomButton";
import { Main } from "../../../components/Main";
import { Space, customSpace } from "../../../components/Space";
import { Table } from "../../../components/Table";
import { TableColumnName } from "../../../components/TableColumnName";
import { Title } from "../../../components/Title";
import { WrapperBig } from "../../../components/WrapperBig";
import { type Languages, dayDiff, monthDiff, useTranslation } from "../../../utils";
import { ScheduledPaymentRow } from "../../components/ScheduledPaymentRow";
import {
  myLoansFragment,
  myLoansPaginationFragment,
  myLoansQueriesRowRefetchableFragment,
  subscriptionMyLoans,
  subscriptionMyLoansUpdate,
} from "./MyLoansQueries";
import type { MyLoansQueriesPaginationUser } from "./__generated__/MyLoansQueriesPaginationUser.graphql";
import type { MyLoansQueriesQuery } from "./__generated__/MyLoansQueriesQuery.graphql";
import type { MyLoansQueriesRefetchQuery } from "./__generated__/MyLoansQueriesRefetchQuery.graphql";
import type { MyLoansQueriesRowRefetch_loan$key } from "./__generated__/MyLoansQueriesRowRefetch_loan.graphql";
import type { MyLoansQueriesSubscription } from "./__generated__/MyLoansQueriesSubscription.graphql";
import type { MyLoansQueriesUpdateSubscription } from "./__generated__/MyLoansQueriesUpdateSubscription.graphql";
import type { MyLoansQueries_user$key } from "./__generated__/MyLoansQueries_user.graphql";

interface Props {
  fintechQuery: PreloadedQuery<MyLoansQueriesQuery>;
  language: Languages;
}

const baseLoanRowStatus = stylex.create({
  base: {
    color: "#333",
    display: "table-cell",
  },
});

const baseLoanRowStatusBox = stylex.create({
  base: {
    padding: "4px",
    borderRadius: "4px",
    textAlign: "center",
    flex: "1",
    color: "white",
  },
  financing: {
    backgroundColor: "#4F7942",
  },
  default: {
    backgroundColor: "#FF9F00",
  },
  scheduledPaymentsDelayed: {
    backgroundColor: "#FF9F00",
    maxWidth: "200px",
  },
  scheduledPaymentsPaid: {
    backgroundColor: "#44d43b",
    maxWidth: "200px",
  },
  scheduledPaymentsToBePaid: {
    backgroundColor: "#046307",
    maxWidth: "200px",
  },
  scheduledPaymentsDefault: {
    backgroundColor: "white",
    maxWidth: "200px",
  },
});

const baseLoanRowContainer = stylex.create({
  base: {
    height: "50px",
    backgroundColor: "white",
  },
});

const baseLoanRowBorrowerIconBox = stylex.create({
  base: {
    width: "30px",
    display: "table-cell",
    textAlign: "center",
  },
});

const baseLoanRowBorrowerIcon = stylex.create({
  base: {
    height: "1rem",
    color: "rgb(62,62,62)",
    cursor: "pointer",
    backgroundColor: "rgb(245,245,245)",
    margin: "auto",
  },
});

const baseLoanRowClipboard = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
});

const baseLoanRowIcon = stylex.create({
  base: {
    height: "1rem",
    color: "rgb(255,90,96)",
  },
});

const baseLoanRowScore = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    display: "table-cell",
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

const baseLoanRowCell = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    display: "table-cell",
  },
});

const getStatus = (status: StatusLoan, t: (name: string) => string) => {
  switch (status) {
    case "FINANCING":
      return t("Financiando");
    case "PAID":
      return t("Pagado");
    case "PAST_DUE":
      return t("Vencido");
    case "TO_BE_PAID":
      return t("Por pagar");
    case "WAITING_FOR_APPROVAL":
      return t("Por aprobar");
    default:
      return "";
  }
};

type StatusLoan = "PAID" | "TO_BE_PAID" | "FINANCING" | "WAITING_FOR_APPROVAL" | "PAST_DUE";

const Cell: FC<{ id: string }> = ({ id }) => {
  const configLoansUpdate = useMemo<GraphQLSubscriptionConfig<MyLoansQueriesUpdateSubscription>>(
    () => ({
      variables: {
        gid: id,
      },
      subscription: subscriptionMyLoansUpdate,
    }),
    [id],
  );

  useSubscription<MyLoansQueriesUpdateSubscription>(configLoansUpdate);

  return (
    <td {...stylex.props(baseLoanRowClipboard.base)}>
      <FaClipboard
        onClick={() => {
          window.navigator.clipboard.writeText(id);
        }}
        {...stylex.props(baseLoanRowIcon.base)}
      />
    </td>
  );
};

const RefetchCell: FC<{ loan: MyLoansQueriesRowRefetch_loan$key }> = ({ loan }) => {
  const [, refetch] = useRefetchableFragment<MyLoansQueriesRefetchQuery, MyLoansQueriesRowRefetch_loan$key>(myLoansQueriesRowRefetchableFragment, loan);
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

const columnMyLoans: {
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
      status: StatusLoan;
    };
    t: (text: string) => string;
    setShowSubTable: Dispatch<SetStateAction<string>>;
    loan: MyLoansQueriesRowRefetch_loan$key;
  }) => ReactElement;
}[] = [
  {
    id: "space",
    header: () => <th {...stylex.props(customSpace.w50)} />,
    cell: ({ info, setShowSubTable }) => (
      <td {...stylex.props(baseLoanRowBorrowerIconBox.base)}>
        {info.status === "PAID" ||
          info.status === "PAST_DUE" ||
          (info.status === "TO_BE_PAID" && (
            <FaPlusSquare
              onClick={() => {
                setShowSubTable((state) => (info.id === state ? "" : info.id));
              }}
              {...stylex.props(baseLoanRowBorrowerIcon.base)}
            />
          ))}
      </td>
    ),
  },
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
    cell: ({ info }) => <td {...stylex.props(baseLoanRowCell.base)}>{info.ROI}%</td>,
  },
  {
    id: "goal",
    header: (t) => <TableColumnName>{t("Monto")}</TableColumnName>,
    cell: ({ info }) => <td {...stylex.props(baseLoanRowCell.base)}>{info.goal}</td>,
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
    cell: ({ info }) => <td {...stylex.props(baseLoanRowCell.base)}>{info.pending}</td>,
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
          {months || days} {months ? t("meses") : t("dias")}
        </td>
      );
    },
  },
  {
    id: "status",
    header: (t) => <TableColumnName>{t("Estatus")}</TableColumnName>,
    cell: ({ info, t }) => (
      <td {...stylex.props(baseLoanRowStatus.base)}>
        <div {...stylex.props(baseLoanRowStatusBox.base, info.status === "FINANCING" ? baseLoanRowStatusBox.financing : baseLoanRowStatusBox.default)}>
          {getStatus(info.status, t)}
        </div>
      </td>
    ),
  },
  {
    id: "refetch",
    header: (t) => <TableColumnName>{t("Refrescar")}</TableColumnName>,
    cell: ({ loan }) => <RefetchCell loan={loan} />,
  },
];

export const MyLoansPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const [showSubTable, setShowSubTable] = useState("");
  const { user } = usePreloadedQuery(myLoansFragment, props.fintechQuery);
  const { data, loadNext, refetch } = usePaginationFragment<MyLoansQueriesPaginationUser, MyLoansQueries_user$key>(myLoansPaginationFragment, user);

  const connectionMyLoansID = ConnectionHandler.getConnectionID(user?.id || "", "MyLoansQueries_user_myLoans", {
    reset,
  });

  const configMyLoans = useMemo<GraphQLSubscriptionConfig<MyLoansQueriesSubscription>>(
    () => ({
      variables: {
        reset,
        connections: [connectionMyLoansID],
      },
      subscription: subscriptionMyLoans,
    }),
    [connectionMyLoansID, reset],
  );

  useSubscription<MyLoansQueriesSubscription>(configMyLoans);

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
              {columnMyLoans.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.myLoans?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const { id, user_id, score, ROI, goal, term, expiry, status, pending } = node;
              return (
                <Fragment key={node.id}>
                  <tr {...stylex.props(baseLoanRowContainer.base)}>
                    {columnMyLoans.map((column) => (
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
                            status: status as StatusLoan,
                            pending,
                          },
                          t,
                          setShowSubTable,
                          loan: node,
                        })}
                      </Fragment>
                    ))}
                  </tr>
                  {showSubTable === node.id ? <ScheduledPaymentRow loan_gid={node.id} language={props.language} /> : null}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton color="secondary" text={t("Cargar más")} onClick={() => loadNext(5)} />
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
                { fetchPolicy: "network-only" },
              );
            }}
          />
        </Columns>
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

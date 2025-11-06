import * as stylex from "@stylexjs/stylex";
import { type FC, Fragment, ReactElement, useMemo, useState } from "react";
import {
  type PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useRefetchableFragment,
  useSubscription,
} from "react-relay/hooks";
import {
  ConnectionHandler,
  type GraphQLSubscriptionConfig,
} from "relay-runtime";
import FaClipboard from "../../../assets/clipboard-solid.svg";
import FaSyncAlt from "../../../assets/rotate-solid.svg";
import { Columns, baseColumn } from "../../../components/Colums";
import { CustomButton } from "../../../components/CustomButton";
import { Main } from "../../../components/Main";
import { Select } from "../../../components/Select";
import { Space, customSpace } from "../../../components/Space";
import { Table } from "../../../components/Table";
import { TableColumnName } from "../../../components/TableColumnName";
import { Title } from "../../../components/Title";
import { WrapperBig } from "../../../components/WrapperBig";
import { getDateFormat, useTranslation } from "../../../utils";
import {
  investmentRowRefetchableFragment,
  myInvestmentsFragment,
  myInvestmentsPaginationFragment,
  subscriptionInvestments,
  subscriptionInvestmentsUpdate,
} from "./MyInvestmentsQueries";
import type { MyInvestmentRowRefetchQuery } from "./__generated__/MyInvestmentRowRefetchQuery.graphql";
import type { MyInvestmentsQueriesPaginationUser } from "./__generated__/MyInvestmentsQueriesPaginationUser.graphql";
import type { MyInvestmentsQueriesQuery } from "./__generated__/MyInvestmentsQueriesQuery.graphql";
import type { MyInvestmentsQueriesRow_investment$key } from "./__generated__/MyInvestmentsQueriesRow_investment.graphql";
import type { MyInvestmentsQueriesSubscription } from "./__generated__/MyInvestmentsQueriesSubscription.graphql";
import type { MyInvestmentsQueriesUpdateSubscription } from "./__generated__/MyInvestmentsQueriesUpdateSubscription.graphql";
import type { MyInvestmentsQueries_user$key } from "./__generated__/MyInvestmentsQueries_user.graphql";

const baseInvestmentRowBox = stylex.create({
  base: {
    height: "50px",
    backgroundColor: "white",
  },
});

const baseInvestmentRowClipboard = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
});

const baseInvestmentRowCell = stylex.create({
  base: {
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    minWidth: "100px",
  },
});

const baseInvestmentRowStatus = stylex.create({
  base: {
    color: "#333",
    display: "table-cell",
    minWidth: "120px",
  },
});

const baseInvestmentRowIcon = stylex.create({
  base: {
    height: "1rem",
    color: "rgb(90,96,255)",
    minWidth: "60px",
  },
});

const baseInvestmentRowStatusBar = stylex.create({
  base: {
    margin: "4px",
    borderRadius: "4px",
    textAlign: "center",
    padding: "3px 0px",
    color: "white",
  },
  delayPayment: {
    backgroundColor: "#FF9F00",
  },
  financing: {
    backgroundColor: "#4F7942",
  },
  paid: {
    backgroundColor: "#046307",
  },
  pastDue: {
    backgroundColor: "#CA3435",
  },
  upToDate: {
    backgroundColor: "#44d43b",
  },
  default: {
    backgroundColor: "white",
  },
});

type Status =
  | "DELAY_PAYMENT"
  | "FINANCING"
  | "PAID"
  | "PAST_DUE"
  | "UP_TO_DATE";

const status = (status: Status, t: (name: string) => string) => {
  switch (status) {
    case "DELAY_PAYMENT":
      return t("Atrasado");
    case "FINANCING":
      return t("Financiandose");
    case "PAID":
      return t("Pagado");
    case "PAST_DUE":
      return t("Vencido");
    case "UP_TO_DATE":
      return t("Al día");
    default:
      return "";
  }
};
const statusStyle = (status: Status) => {
  switch (status) {
    case "DELAY_PAYMENT":
      return baseInvestmentRowStatusBar.delayPayment;
    case "FINANCING":
      return baseInvestmentRowStatusBar.financing;
    case "PAID":
      return baseInvestmentRowStatusBar.paid;
    case "PAST_DUE":
      return baseInvestmentRowStatusBar.pastDue;
    case "UP_TO_DATE":
      return baseInvestmentRowStatusBar.upToDate;
    default:
      return baseInvestmentRowStatusBar.default;
  }
};

interface Props {
  fintechQuery: PreloadedQuery<MyInvestmentsQueriesQuery>;
}

const RefetchCell: FC<{
  investment: MyInvestmentsQueriesRow_investment$key;
}> = ({ investment }) => {
  const [, refetch] = useRefetchableFragment<
    MyInvestmentRowRefetchQuery,
    MyInvestmentsQueriesRow_investment$key
  >(investmentRowRefetchableFragment, investment);
  return (
    <td
      {...stylex.props(baseInvestmentRowClipboard.base)}
      onClick={() => {
        refetch({}, { fetchPolicy: "network-only" });
      }}
    >
      <FaSyncAlt {...stylex.props(baseInvestmentRowIcon.base)} />
    </td>
  );
};

const columns: {
  id: string;
  header: (t: (text: string) => string) => ReactElement;
  cell: (info: {
    info: {
      id: string;
      borrower_id: string;
      loan_id: string;
      quantity: string;
      status: Status;
      paid_already: string;
      interest_to_earn: string;
      moratory: string;
      created_at: number;
      updated_at: number;
      to_be_paid: string;
    };
    t: (text: string) => string;
    investment: MyInvestmentsQueriesRow_investment$key;
  }) => ReactElement;
}[] = [
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "borrower_id",
    header: (t) => <TableColumnName>{t("ID deudor")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.borrower_id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "loan_id",
    header: (t) => <TableColumnName>{t("ID deuda")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.loan_id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "quantity",
    header: (t) => <TableColumnName>{t("Cantidad")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowCell.base)}>{info.quantity}</td>
    ),
  },
  {
    id: "status",
    header: (t) => <TableColumnName>{t("Estatus")}</TableColumnName>,
    cell: ({ info, t }) => (
      <td {...stylex.props(baseInvestmentRowStatus.base)}>
        <div
          {...stylex.props(
            baseInvestmentRowStatusBar.base,
            statusStyle(info.status)
          )}
        >
          {status(info.status as Status, t)}
        </div>
      </td>
    ),
  },
  {
    id: "paid",
    header: (t) => <TableColumnName>{t("Pagado")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowCell.base)}>{info.paid_already}</td>
    ),
  },
  {
    id: "owe",
    header: (t) => <TableColumnName>{t("Pagado")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowCell.base)}>{info.to_be_paid}</td>
    ),
  },
  {
    id: "interests",
    header: (t) => <TableColumnName>{t("Intereses")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowCell.base)}>
        {info.interest_to_earn}
      </td>
    ),
  },
  {
    id: "moratory",
    header: (t) => <TableColumnName>{t("Interés por mora")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseInvestmentRowCell.base)}>{info.moratory}</td>
    ),
  },
  {
    id: "created",
    header: (t) => <TableColumnName>{t("Creado en")}</TableColumnName>,
    cell: ({ info }) => {
      const date = new Date(info.created_at);
      const formattedDate = getDateFormat(date);
      return (
        <td {...stylex.props(baseInvestmentRowCell.base)}>{formattedDate}</td>
      );
    },
  },
  {
    id: "updated",
    header: (t) => <TableColumnName>{t("Último cambio en")}</TableColumnName>,
    cell: ({ info }) => {
      const date = new Date(info.updated_at);
      const formattedDate = getDateFormat(date);
      return (
        <td {...stylex.props(baseInvestmentRowCell.base)}>{formattedDate}</td>
      );
    },
  },
  {
    id: "refetch",
    header: (t) => <TableColumnName>{t("Refrescar")}</TableColumnName>,
    cell: ({ investment }) => <RefetchCell investment={investment} />,
  },
];

export const MyInvestmentsPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const { user } = usePreloadedQuery(myInvestmentsFragment, props.fintechQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsQueriesPaginationUser,
    MyInvestmentsQueries_user$key
  >(myInvestmentsPaginationFragment, user);

  const [investmentStatus, setInvestmentStatus] = useState<
    "none" | "on_going" | "over"
  >("none");

  const status: Status[] | null = useMemo(() => {
    return investmentStatus === "on_going"
      ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
      : investmentStatus === "over"
      ? ["PAID", "PAST_DUE"]
      : null;
  }, [investmentStatus]);

  const connectionInvestmentID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "MyInvestmentsQueries_user_investments",
    {
      status,
      reset,
    }
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsQueriesSubscription>
  >(
    () => ({
      variables: {
        status,
        reset,
        connections: [connectionInvestmentID],
      },
      subscription: subscriptionInvestments,
    }),
    [status, connectionInvestmentID, reset]
  );
  const configInvestmentsUpdate = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsQueriesUpdateSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionInvestmentsUpdate,
    }),
    []
  );
  useSubscription<MyInvestmentsQueriesSubscription>(configInvestments);
  useSubscription<MyInvestmentsQueriesUpdateSubscription>(
    configInvestmentsUpdate
  );

  if (!user) {
    return null;
  }

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Mis inversiones")} />
        <Select
          value={investmentStatus}
          onChange={(e) => {
            const investmentStatus = e.target.value as
              | "on_going"
              | "over"
              | "none";
            setInvestmentStatus(investmentStatus);
            const status: Status[] | null =
              investmentStatus === "on_going"
                ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
                : investmentStatus === "over"
                ? ["PAID", "PAST_DUE"]
                : null;
            refetch(
              {
                status,
              },
              { fetchPolicy: "network-only" }
            );
          }}
          options={[
            {
              value: "on_going",
              label: t("En curso"),
            },
            {
              value: "over",
              label: t("Terminados"),
            },
            {
              value: "none",
              label: t("Selecciona..."),
            },
          ]}
        />
        <Table color="secondary">
          <thead>
            <tr>
              {columns.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.investments?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const {
                id,
                borrower_id,
                loan_id,
                quantity,
                status,
                paid_already,
                interest_to_earn,
                moratory,
                created_at,
                updated_at,
                to_be_paid,
              } = node;
              return (
                <tr key={id} {...stylex.props(baseInvestmentRowBox.base)}>
                  {columns.map((column) => (
                    <Fragment key={column.id}>
                      {column.cell({
                        info: {
                          id,
                          borrower_id,
                          loan_id,
                          quantity,
                          status: status as Status,
                          paid_already,
                          interest_to_earn,
                          moratory,
                          created_at,
                          updated_at,
                          to_be_paid,
                        },
                        t,
                        investment: node,
                      })}
                    </Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
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
              const time = new Date().getTime();
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
      </WrapperBig>
    </Main>
  );
};

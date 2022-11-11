import React, { CSSProperties, FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay/hooks";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";
import dayjs from "dayjs";
import { useTranslation } from "utils";
import { FaClipboard, FaSyncAlt } from "react-icons/fa";

const investmentRowRefetchableFragment = graphql`
  fragment InvestmentRow_investment on Investment
  @refetchable(queryName: "InvestmentRowRefetchQuery") {
    id
    id_borrower
    _id_loan
    quantity
    created
    updated
    status
    payments
    ROI
    term
    moratory
    interest_to_earn
    paid_already
    to_be_paid
  }
`;

type Props = {
  investment: InvestmentRow_investment$key;
};

export const InvestmentRow: FC<Props> = ({ investment }) => {
  const { t } = useTranslation();
  const [data, refetch] = useRefetchableFragment<
    InvestmentRowRefetchQuery,
    InvestmentRow_investment$key
  >(investmentRowRefetchableFragment, investment);
  const status = () => {
    switch (data.status) {
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
  const statusColor = () => {
    switch (data.status) {
      case "DELAY_PAYMENT":
        return "#FF9FF00";
      case "FINANCING":
        return "#4F7942";
      case "PAID":
        return "#046307";
      case "PAST_DUE":
        return "#CA3435";
      case "UP_TO_DATE":
        return "#44d43b";
      default:
        return "white";
    }
  };
  return (
    <div style={style.container}>
      <div style={style.clipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.id);
          }}
          size={18}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.clipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.id_borrower);
          }}
          size={18}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.clipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data._id_loan);
          }}
          size={18}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.cell}>{data.quantity}</div>
      <div style={style.status}>
        <div
          style={{
            margin: "4px",
            backgroundColor: statusColor(),
            borderRadius: 4,
            textAlign: "center",
            flex: 1,
            padding: "3px 0px",
            color: "white",
          }}
        >
          {status()}
        </div>
      </div>
      <div style={style.cell}>{data.paid_already}</div>
      <div style={style.cell}>{data.to_be_paid}</div>
      <div style={style.cell}>{data.interest_to_earn}</div>
      <div style={style.cell}>{data.moratory}</div>
      <div style={style.cell}>{dayjs(data.updated).format("dd/mm/yyyy")}</div>
      <div style={style.cell}>{dayjs(data.created).format("dd/MM/yyyy")}</div>
      <div
        style={style.clipboard}
        onClick={() => {
          refetch({}, { fetchPolicy: "network-only" });
        }}
      >
        <FaSyncAlt size={18} color={"rgb(90,96,255)"} />
      </div>
    </div>
  );
};

const style: Record<
  "cell" | "clipboard" | "container" | "status",
  CSSProperties
> = {
  cell: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
  },
  status: {
    flex: 1,
    backgroundColor: "white",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clipboard: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
};

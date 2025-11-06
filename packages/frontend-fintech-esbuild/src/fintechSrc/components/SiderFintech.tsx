import * as stylex from "@stylexjs/stylex";
import { type FC, useMemo } from "react";
import {
  type PreloadedQuery,
  graphql,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import FaCartPlus from "../../assets/cart-plus-solid.svg";
import FaFileContract from "../../assets/file-contract-solid.svg";
import FaFileAlt from "../../assets/file-lines-solid.svg";
import FaFunnelDollar from "../../assets/filter-circle-dollar-solid.svg";
import FaFolder from "../../assets/folder-solid.svg";
import FaExchangeAlt from "../../assets/hand-holding-dollar-solid.svg";
import FaHandHolding from "../../assets/hand-holding-hand-solid.svg";
import FaMoneyCheck from "../../assets/money-check-dollar-solid.svg";
import FaUserAlt from "../../assets/user-large-solid.svg";
import { AccountInfo } from "../../components/AccountInfo";
import { AccountLink } from "../../components/AccountLink";
import { Icon } from "../../components/Icon";
import { useLocation } from "../../react-router-elements/utils";
import { useTranslation } from "../../utils";
import type { utilsFintechQuery } from "../__generated__/utilsFintechQuery.graphql";
import type { SiderFintechUserSubscription } from "./__generated__/SiderFintechUserSubscription.graphql";

export const fintechUserQuery = graphql`
  query SiderFintechQuery @preloadable {
    user {
      accountAvailable
      accountTotal
    }
  }
`;

const baseRoutesIcon = stylex.create({
  base: {
    height: "1.8rem",
  },
});

const baseSider = stylex.create({
  base: {
    gridRowStart: "1",
    gridRowEnd: "3",
    gridColumnStart: "1",
    gridColumnEnd: "1",
    display: "flex",
    overflow: "hidden",
    flex: "1",
    position: "relative",
  },
});

const siderMenu = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflow: "scroll",
    width: "100%",
  },
});

const subscriptionUser = graphql`
  subscription SiderFintechUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountToBePaid
      accountTotal
      accountWithheld
    }
  }
`;

export const SiderFintech: FC<{
  fintechQuery: PreloadedQuery<utilsFintechQuery>;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
}> = ({ fintechQuery, isBorrower, isSupport, isLender }) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(fintechUserQuery, fintechQuery);

  const configUser = useMemo<
    GraphQLSubscriptionConfig<SiderFintechUserSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    []
  );

  useSubscription<SiderFintechUserSubscription>(configUser);

  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <div {...stylex.props(baseSider.base)}>
      <div {...stylex.props(siderMenu.base)}>
        {isBorrower ? (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              type={"total"}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              type={"available"}
            />
            <AccountLink
              icon={<FaFileAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mi cuenta")}
              path="/account"
              location={location}
            />
            <AccountLink
              icon={<FaMoneyCheck {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Pedir prestamo")}
              path="/addLoan"
              location={location}
            />
            <AccountLink
              icon={<FaFileContract {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis prestamos")}
              path="/myLoans"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title="Settings"
              path="/settings"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
          </>
        ) : isSupport ? (
          <>
            <Icon />
            <AccountLink
              icon={<FaFileContract {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Aprobar prestamo")}
              path="/approveLoan"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title="Settings"
              path="/settings"
              location={location}
            />
          </>
        ) : isLender ? (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              type={"total"}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              type={"available"}
            />
            <AccountLink
              icon={<FaFileAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mi cuenta")}
              path="/account"
              location={location}
            />
            <AccountLink
              icon={<FaCartPlus {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Comprar")}
              path="/addInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaFolder {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis inversiones")}
              path="/myInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Configuración")}
              path="/settings"
              location={location}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

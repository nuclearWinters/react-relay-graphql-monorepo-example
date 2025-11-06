import { type ChangeEvent, useState } from "react";
import { type EntryPointComponent, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { FormSmall } from "../../../components/FormSmall";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Main } from "../../../components/Main";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { Space, customSpace } from "../../../components/Space";
import { Title } from "../../../components/Title";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { RetireFundsButton } from "../../../fintechSrc/components/RetireFundsButton";
import { useTranslation } from "../../../utils";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  authQuery: utilsAuthQuery;
}

export const RetireFunds: EntryPointComponent<
  Queries,
  Record<string, undefined>
> = (props) => {
  const { t } = useTranslation();
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );
  const [quantity, setQuantity] = useState("");
  const handleQuantityOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number.isNaN(Number(value))) {
      return;
    }
    setQuantity(value);
  };
  const handleQuantityOnBlur = () => {
    setQuantity((state) => {
      if (Number(state) === 0) {
        return "";
      }
      return Number(state).toFixed(2);
    });
  };

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport) {
    return (
      <RedirectContainer
        allowed={["lender", "borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Retirar fondos")} />
        <FormSmall>
          <Label label={t("Cantidad")} />
          <Input
            placeholder={t("Cantidad")}
            value={quantity}
            name="quantity"
            onChange={handleQuantityOnChange}
            onBlur={handleQuantityOnBlur}
          />
          <Space styleX={customSpace.h30} />
          <RetireFundsButton quantity={quantity} />
          <Space styleX={customSpace.h30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default RetireFunds;

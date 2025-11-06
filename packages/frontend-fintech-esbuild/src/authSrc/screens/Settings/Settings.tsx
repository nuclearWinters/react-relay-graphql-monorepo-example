import * as stylex from "@stylexjs/stylex";
import {
  type ChangeEvent,
  type FC,
  Fragment,
  ReactElement,
  useState,
} from "react";
import {
  type EntryPointComponent,
  graphql,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import FaTrashAlt from "../../../assets/trash-alt-solid.svg";
import { Columns, baseColumn } from "../../../components/Colums";
import { CustomButton } from "../../../components/CustomButton";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Main } from "../../../components/Main";
import { Rows, baseRows } from "../../../components/Rows";
import { Select } from "../../../components/Select";
import { Space, customSpace } from "../../../components/Space";
import { Spinner } from "../../../components/Spinner";
import { Table } from "../../../components/Table";
import { TableColumnName } from "../../../components/TableColumnName";
import { Title } from "../../../components/Title";
import { WrapperBig, baseWrapperBig } from "../../../components/WrapperBig";
import {
  type Languages,
  getLongDateName,
  useTranslation,
} from "../../../utils";
import {
  settingsFragment,
  settingsLoginsPaginationFragment,
  settingsSessionsPaginationFragment,
} from "./SettingsQueries";
import type { SettingsLoginsPaginationUser } from "./__generated__/SettingsLoginsPaginationUser.graphql";
import type { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import type { SettingsQueriesAuthUserQuery } from "./__generated__/SettingsQueriesAuthUserQuery.graphql";
import type { SettingsQueries_logins_user$key } from "./__generated__/SettingsQueries_logins_user.graphql";
import type { SettingsQueries_sessions_user$key } from "./__generated__/SettingsQueries_sessions_user.graphql";
import type { SettingsSessionRowRevokeSessionMutation } from "./__generated__/SettingsSessionRowRevokeSessionMutation.graphql";
import type { SettingsSessionsPaginationUser } from "./__generated__/SettingsSessionsPaginationUser.graphql";

const baseLoanRowIcon = stylex.create({
  base: {
    height: "1rem",
    color: "rgb(255,90,96)",
    margin: "auto",
  },
});

const baseLoanRowClipboard = stylex.create({
  base: {
    display: "table-cell",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
    minWidth: "60px",
  },
});

const baseLoanRowCell = stylex.create({
  base: {
    display: "table-cell",
    textAlign: "center",
    color: "#333",
  },
});

const baseLoanRowContainer = stylex.create({
  base: {
    height: "50px",
    backgroundColor: "white",
  },
});

const columnLogin: {
  id: string;
  header: (t: (text: string) => string) => ReactElement;
  cell: (info: {
    info: {
      applicationName: string;
      time: string;
      address: string;
    };
    t: (text: string) => string;
    language: Languages;
  }) => ReactElement;
}[] = [
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.applicationName}</td>
    ),
  },
  {
    id: "time",
    header: (t) => <TableColumnName>{t("Fecha")}</TableColumnName>,
    cell: ({ info, language }) => {
      const date = new Date(info.time);
      const dateFormatted = getLongDateName(date, language);
      return <td {...stylex.props(baseLoanRowCell.base)}>{dateFormatted}</td>;
    },
  },
  {
    id: "address",
    header: (t) => <TableColumnName>{t("IP")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.address}</td>
    ),
  },
];

const DeleteCell: FC<{ id: string }> = ({ id }) => {
  const [commitRevokeSession, isInFlightRevokeSession] =
    useMutation<SettingsSessionRowRevokeSessionMutation>(graphql`
      mutation SettingsSessionRowRevokeSessionMutation(
        $input: RevokeSessionInput!
      ) {
        revokeSession(input: $input) {
          error
          session {
            id
            expirationDate
          }
        }
      }
    `);
  return isInFlightRevokeSession ? (
    <Spinner />
  ) : (
    <td
      {...stylex.props(baseLoanRowClipboard.base)}
      onClick={() => {
        commitRevokeSession({
          variables: { input: { sessionId: id } },
        });
      }}
    >
      <FaTrashAlt {...stylex.props(baseLoanRowIcon.base)} />
    </td>
  );
};

const columnSession: {
  id: string;
  header: (t: (text: string) => string) => ReactElement;
  cell: (info: {
    info: {
      id: string;
      applicationName: string;
      deviceOS: string;
      deviceBrowser: string;
      address: string;
      lastTimeAccessed: string;
    };
    t: (text: string) => string;
    language: Languages;
  }) => ReactElement;
}[] = [
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.id}</td>
    ),
  },
  {
    id: "applicationName",
    header: (t) => <TableColumnName>{t("Aplicacion")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.applicationName}</td>
    ),
  },
  {
    id: "deviceBrowser",
    header: (t) => (
      <TableColumnName>{t("Tipo de dispositivo")}</TableColumnName>
    ),
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.deviceBrowser}</td>
    ),
  },
  {
    id: "deviceOS",
    header: (t) => (
      <TableColumnName>{t("Nombre del dispositivo")}</TableColumnName>
    ),
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.deviceOS}</td>
    ),
  },
  {
    id: "lastTimeAccessed",
    header: (t) => (
      <TableColumnName>{t("Ultima vez accedido")}</TableColumnName>
    ),
    cell: ({ info, language }) => {
      const date = new Date(info.lastTimeAccessed);
      const dateFormatted = getLongDateName(date, language);
      return <td {...stylex.props(baseLoanRowCell.base)}>{dateFormatted}</td>;
    },
  },
  {
    id: "address",
    header: (t) => <TableColumnName>{t("IP")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.address}</td>
    ),
  },
  {
    id: "delete",
    header: (t) => <TableColumnName>{t("Borrar")}</TableColumnName>,
    cell: ({ info }) => <DeleteCell id={info.id} />,
  },
];

export const baseSettingsForm = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    alignSelf: "center",
    width: "70%",
    flexDirection: "column",
  },
});

export interface Queries {
  [key: string]: OperationType;
  authQuery: SettingsQueriesAuthUserQuery;
}

export const Settings: EntryPointComponent<
  Queries,
  Record<string, undefined>
> = (props) => {
  const { t, changeLanguage } = useTranslation();
  const [commit, isInFlight] = useMutation<SettingsMutation>(graphql`
    mutation SettingsMutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        error
        authUser {
          id
          name
          apellidoPaterno
          apellidoMaterno
          RFC
          CURP
          clabe
          mobile
          language
          email
        }
      }
    }
  `);
  const { authUser } = usePreloadedQuery(
    settingsFragment,
    props.queries.authQuery
  );
  const originLang = authUser?.language as Languages;
  const [formUser, setFormUser] = useState({
    name: authUser?.name || "",
    apellidoMaterno: authUser?.apellidoMaterno || "",
    apellidoPaterno: authUser?.apellidoPaterno || "",
    CURP: authUser?.CURP || "",
    RFC: authUser?.RFC || "",
    mobile: authUser?.mobile || "",
    clabe: authUser?.clabe || "",
    email: authUser?.email || "",
    language: originLang as Languages,
  });
  const handleFormUser = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  const handleSelectUser = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "EN" | "ES";
    const name = e.target.name;
    changeLanguage(value);
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  const { data: loginsData, loadNext: loginsLoadNext } = usePaginationFragment<
    SettingsLoginsPaginationUser,
    SettingsQueries_logins_user$key
  >(settingsLoginsPaginationFragment, authUser);
  const { data: sessionsData, loadNext: sessionsLoadNext } =
    usePaginationFragment<
      SettingsSessionsPaginationUser,
      SettingsQueries_sessions_user$key
    >(settingsSessionsPaginationFragment, authUser);

  if (!authUser) {
    return null;
  }

  return (
    <Main>
      <WrapperBig styleX={[baseWrapperBig.base, baseWrapperBig.settings]}>
        <Title text={t("Datos generales")} />
        <div {...stylex.props(baseSettingsForm.base)}>
          <Label label={t("Nombre(s)")} />
          <Input
            placeholder={t("Nombre(s)")}
            value={formUser.name}
            name="name"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Apellido paterno")} />
              <Input
                placeholder={t("Apellido paterno")}
                value={formUser.apellidoPaterno}
                name="apellidoPaterno"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Apellido materno")} />
              <Input
                placeholder={t("Apellido materno")}
                value={formUser.apellidoMaterno}
                name="apellidoMaterno"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Label label={t("RFC")} />
          <Input
            placeholder={t("RFC")}
            value={formUser.RFC}
            name="RFC"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("CURP")} />
              <Input
                placeholder={t("CURP")}
                value={formUser.CURP}
                name="CURP"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Clabe")} />
              <Input
                placeholder={t("Clabe")}
                value={formUser.clabe}
                name="clabe"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Columns>
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Celular")} />
              <Input
                placeholder={t("Celular")}
                value={formUser.mobile}
                name="mobile"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Email")} />
              <Input
                placeholder={t("Email")}
                value={formUser.email}
                name="email"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Space styleX={customSpace.h30} />
          <Select
            value={formUser.language}
            name="language"
            options={[
              { value: "EN", label: "English" },
              { value: "ES", label: "Español" },
            ]}
            onChange={handleSelectUser}
          />
          <Space styleX={customSpace.h30} />
          <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
            {isInFlight ? (
              <Spinner />
            ) : (
              <CustomButton
                text={t("Actualizar")}
                onClick={() => {
                  commit({
                    variables: {
                      input: formUser,
                    },
                  });
                }}
              />
            )}
          </Columns>
          <Space styleX={customSpace.h30} />
        </div>
        <Title text={t("Logins")} />
        <Table color="primary">
          <thead>
            <tr>
              {columnLogin.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {loginsData?.logins?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const { id, applicationName, time, address } = node;
              return (
                <tr key={id} {...stylex.props(baseLoanRowContainer.base)}>
                  {columnLogin.map((column) => (
                    <Fragment key={column.id}>
                      {column.cell({
                        info: {
                          applicationName,
                          time,
                          address,
                        },
                        t,
                        language: originLang,
                      })}
                    </Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <CustomButton
          color="secondary"
          text={t("Cargar más")}
          onClick={() => loginsLoadNext(5)}
        />
        <Space styleX={customSpace.h20} />
        <Title text={t("Sessions")} />
        <Table color="secondary">
          <thead>
            <tr>
              {columnSession.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessionsData?.sessions?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const {
                id,
                applicationName,
                deviceOS,
                deviceBrowser,
                address,
                lastTimeAccessed,
              } = node;
              return (
                <tr key={id} {...stylex.props(baseLoanRowContainer.base)}>
                  {columnSession.map((column) => (
                    <Fragment key={column.id}>
                      {column.cell({
                        info: {
                          id,
                          applicationName,
                          deviceOS,
                          deviceBrowser,
                          address,
                          lastTimeAccessed,
                        },
                        t,
                        language: originLang,
                      })}
                    </Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <CustomButton
          color="secondary"
          text={t("Cargar más")}
          onClick={() => sessionsLoadNext(5)}
        />
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

export default Settings;

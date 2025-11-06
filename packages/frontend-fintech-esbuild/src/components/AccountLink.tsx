import * as stylex from "@stylexjs/stylex";
import type { FC, ReactElement } from "react";
import { Link } from "../react-router-elements/Link";
import type { RouteKeys } from "../router";

interface Props {
  title: string;
  icon: ReactElement;
  path: RouteKeys;
  location: string;
}

export const accountLinkBox = stylex.create({
  base: {
    height: "80px",
    display: "flex",
    borderBottomWidth: "1px",
    borderBottomColor: "rgb(225,225,225)",
    borderBottomStyle: "solid",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
    width: "100%",
    padding: "8px 0px",
  },
  selected: {
    backgroundColor: "rgba(221,221,221,0.48)",
    boxShadow: "rgba(134,134,134,0.75) 0px 1px 7px 0px inset",
  },
  notSelected: {
    backgroundColor: "white",
    boxShadow: "unset",
  },
});

export const accountLinkIcon = stylex.create({
  base: {
    position: "absolute",
    left: "0px",
    top: "0px",
    bottom: "0px",
    width: ".25rem",
    backgroundColor: "rgb(255,90,96)",
  },
});

export const accountLinkTitle = stylex.create({
  base: {
    fontSize: "1rem",
  },
  selected: {
    color: "rgb(255,90,96)",
  },
  notSelected: {
    color: "rgb(62,62,62)",
  },
});

export const AccountLink: FC<Props> = ({ title, icon, path, location }) => {
  const selected = path === location;
  return (
    <Link to={path} {...stylex.props(accountLinkBox.base, selected ? accountLinkBox.selected : accountLinkBox.notSelected)}>
      {selected && <div {...stylex.props(accountLinkIcon.base)} />}
      {icon}
      <div {...stylex.props(accountLinkTitle.base, selected ? accountLinkTitle.selected : accountLinkTitle.notSelected)}>{title}</div>
    </Link>
  );
};

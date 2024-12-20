import * as stylex from "@stylexjs/stylex";
import type { FC } from "react";

export const baseTitle = stylex.create({
  base: {
    textAlign: "center",
    fontSize: "1.625rem",
    padding: "14px 0px",
    borderBottomColor: "rgb(203,203,203)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
});

interface Props {
  text: string;
}

export const Title: FC<Props> = ({ text }) => {
  return <div {...stylex.props(baseTitle.base)}>{text}</div>;
};

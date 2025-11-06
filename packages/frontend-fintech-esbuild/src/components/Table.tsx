import * as stylex from "@stylexjs/stylex";
import type { FC, ReactNode } from "react";

interface Props {
  color: "primary" | "secondary";
  children: ReactNode;
}

export const tableCollapse = stylex.create({
  base: {
    borderCollapse: "collapse",
    width: "100%",
  },
  primary: {
    backgroundColor: "rgba(255,90,96,0.1)",
  },
  default: {
    backgroundColor: "rgba(90,96,255,0.1)",
  },
});

export const overflowXAuto = stylex.create({
  base: {
    overflowX: "auto",
  },
});

export const relativeTableContainer = stylex.create({
  base: {
    position: "relative",
  },
});

export const gradientLeft = stylex.create({
  base: {
    top: "0px",
    bottom: "0px",
    left: "0px",
    width: "20px",
    position: "absolute",
    zIndex: 1,
    backgroundColor:
      "linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    pointerEvents: "none",
  },
});

export const gradientRight = stylex.create({
  base: {
    top: "0px",
    bottom: "0px",
    right: "0px",
    width: "20px",
    position: "absolute",
    zIndex: 1,
    backgroundColor:
      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    pointerEvents: "none",
  },
});

export const Table: FC<Props> = ({ children, color }) => {
  return (
    <div {...stylex.props(relativeTableContainer.base)}>
      <div {...stylex.props(gradientLeft.base)} />
      <div {...stylex.props(gradientRight.base)} />
      <div {...stylex.props(overflowXAuto.base)}>
        <table
          {...stylex.props(
            tableCollapse.base,
            color === "primary" ? tableCollapse.primary : tableCollapse.default
          )}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

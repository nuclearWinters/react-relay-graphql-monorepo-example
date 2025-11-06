import type { FC, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { type RouteKeys, references } from "../router";
import { historyPush, historyReplace } from "./utils";

export const Link: FC<{
  to: RouteKeys;
  replace?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ to, replace, children, className }) => {
  const preloadRouteCode = () => {
    references[to].entrypoint?.getComponent();
  };

  const preloadRoute = () => {
    references[to].loader();
  };

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    if (replace) {
      historyReplace(to);
    } else {
      historyPush(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} onMouseEnter={preloadRouteCode} onMouseDown={preloadRoute}>
      {children}
    </a>
  );
};

import { type ReactNode } from "react";

export const Header = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-center font-bold">{children}</div>;
};

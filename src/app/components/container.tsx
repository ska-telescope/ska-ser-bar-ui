import { ReactNode } from "react";
import { mergeClasses } from "./utils/utils";

export default function Container({
  className,
  children,
  contain,
}: {
  className?: string;
  children?: ReactNode;
  contain?: boolean;
}) {
  return (
    <div className="flex justify-center text-white">
      <div className="side_panel"></div>
      <div
        className={mergeClasses(
          "min-h-screen grow",
          contain ? "bg-white" : "bg-slate-100"
        )}
      >
        <div className={className}>{children}</div>
      </div>
      <div className="side_panel"></div>
    </div>
  );
}

// import { PlusIcon } from "lucide-react";
import { ReactElement, ReactNode } from "react";

export interface IProps {
  children?: ReactNode;
  icon?: ReactElement;
  label: string;
  onClick?: () => void;
  type?: "submit" | "button";
  width?: string;
}

export const AppButton = (props: IProps) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={
        props.width
          ? `py-3 px-4 flex w-${props.width} place-content-center text-center  text-nowrap gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-400 text-white hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none`
          : "py-3 px-4 flex w-3/4 place-content-center text-center  text-nowrap gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-400 text-white hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
      }
    >
      {props.icon}
      {props.label}
      {props.children ? props.children : ""}
    </button>
  );
};

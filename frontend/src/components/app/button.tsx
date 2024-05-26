import { PlusIcon } from "lucide-react";
import { ReactElement, ReactNode } from "react";

export interface IProps{
    children?: ReactNode;
    icon?: ReactElement;
    label: string;
    onClick?: () => void
    type?: "submit" | "button"
}


export const AppButton = (props:IProps)=>{
    return (
        <button type={props.type || 'button'} onClick={props.onClick} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-primary disabled:opacity-50 disabled:pointer-events-none">
            {props.icon}
            {props.label}
            {props.children ? props.children : ""}
        </button>
    )
}
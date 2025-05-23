import React from "react";
import type { ReactElement } from "react";

interface ButtonProps {
    variant?: "Primary" | "Secondary";
    text: string;
    startIcon?: ReactElement;
    className?: string;
    onClick: () => void;
    loading?: boolean;
}

const variantsClasses = {
    "Primary": "bg-purple-600 text-white",
    "Secondary": "bg-purple-200 text-purple-600"
}

const defaultStyle = "px-4 py-2 rounded-md font-light flex items-center gap-1.5 cursor-pointer"

export const Button = React.forwardRef(({
    variant,
    startIcon,
    text,
    onClick,
    className,
    loading = false
}: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    return <button
        onClick={onClick}
        className={variantsClasses[variant ? variant : "Primary"] + " " + defaultStyle + " " + className}
        ref={ref}
        disabled={loading}
    >{startIcon}{loading ? "Processing" : text}</button>
})
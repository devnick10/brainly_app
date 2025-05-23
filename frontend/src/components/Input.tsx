import React, { type ChangeEvent } from "react"

export const Input = React.forwardRef(({ onChange, placeholder, className, type = 'text', value, name }: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    className?: string,
    type?: string,
    value?: string;
    name?: string;
}, ref: React.Ref<HTMLInputElement>) => {
    return <div>
        <input
            required
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            ref={ref}
            value={value}
            name={name}
            className={`px-4 py-2 bg-white text-black rounded-md border-slate-300 border ${className}`}
        ></input>
    </div>
})
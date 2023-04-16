import { ChangeEventHandler, PropsWithChildren } from "react"

export function Input(props: PropsWithChildren<InputProps>) {
  return (
    <input
      className={
        'w-full p-3 shadow-md rounded-md border-2 ' + props.className ||
        'bg-slate-300 border-slate-400 placeholder-slate-400 text-slate-500'
      }
      type={props.type}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  )
}

type InputProps = {
  className?: string
  type: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}
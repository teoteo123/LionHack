import { MouseEventHandler } from 'react'

function Button(props: ButtonProps) {
  return (
    <button
      className={`flex flex-row items-center justify-center gap-10 p-4 px-5 rw-[165px] rounded-lg ${props.className}`}
      onClick={props.onClick}
    >
      <p className='text-sm'>{props.text}</p>
      {props.svg}
    </button>
  )
}

export type ButtonProps = {
  text: string
  svg?: JSX.Element
  color?: string
  className: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default Button

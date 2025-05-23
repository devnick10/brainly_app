import type { ReactElement } from "react"

export const SidebarItem = ({ text, icon }: {
  text: string,
  icon: ReactElement
}) => {
  return (
    <div className="flex text-gray-700 py-2 cursor-pointer hover:bg-gray-200 max-w-48 pl-4 rounded-md transition-all duration-300">
      <div className="pr-2">
        {icon}
      </div>
      <div className="">
        {text}
      </div>
    </div>
  )
}

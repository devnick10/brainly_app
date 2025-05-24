import { useNavigate } from "react-router-dom"
import { Logo } from "../icons/BrainIcon"
import { HomeIcon } from "../icons/HomeIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutTubeIcon } from "../icons/YoutTubeIcon"
import { Button } from "./Button"
import { SidebarItem } from "./SidebarItem"
import toast from "react-hot-toast"

interface SideBarProps {
    shared?: boolean,
    tweet: () => void,
    youtube: () => void,
    all: () => void
}

export const SideBar = ({ shared, tweet, youtube, all }: SideBarProps) => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col justify-between bg-white border-r-[0.1rem] border-slate-300 pl-6">
            <div>
                <div className="flex pt-4 text-2xl items-center">
                    <div className="pr-2 text-purple-400">
                        <Logo />
                    </div>
                    <h1 className="font-semibold">Brainly</h1>
                </div>
                <div className="pt-8">
                    <div onClick={() => all()}>
                        <SidebarItem text="Home" icon={<HomeIcon />} />
                    </div>
                    <div onClick={() => tweet()}>
                        <SidebarItem text="Twitter" icon={<TwitterIcon />} />
                    </div>
                    <div onClick={() => youtube()}>
                        <SidebarItem text="Youtube" icon={<YoutTubeIcon />} />
                    </div>
                </div>
            </div>
            <div className={`w-full pr-6 pb-2 ${shared ? 'hidden' : null}`}>
                <Button text="Logout" className="w-full justify-center" onClick={() => {
                    localStorage.removeItem('token')
                    navigate('/')
                    toast.success("Logout successfully")
                }} />
            </div>
        </div>

    )
}

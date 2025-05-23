import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { UninstallIcon } from "../icons/UninstallIcon";
import { YoutTubeIcon } from "../icons/YoutTubeIcon";
interface CardProps {
    type: "twitter" | "youtube";
    title: string;
    link: string;
}

export const Card = ({ type, title, link }: CardProps) => {
    return (
        <div className="p-4 max-w-72 border rounded-md bg-white border-slate-200 min-h-48 min-w-72">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 ">
                    <div className="text-gray-500">{type === "twitter" ? <TwitterIcon /> : <YoutTubeIcon />}</div>
                    <div className="text-md font-semibold">{title.slice(0, 20) + "..."}</div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                    <div>
                        <a href={link} target="_blank">
                            <ShareIcon />
                        </a>
                    </div>
                    <div className="cursor-pointer pl-0.5"><UninstallIcon /></div>
                </div>
            </div>

            <div className="pt-4">
                {
                    type === "youtube" && (<>
                        <iframe className="w-full" src={
                            link.replace("watch", "embed").replace("?v=", "/")
                        } title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                        </iframe>
                    </>)
                }
                {
                    type === "twitter" && (<>
                        <blockquote className="twitter-tweet">
                            <a href={link.replace("x.com", "twitter.com")}></a>
                        </blockquote>
                    </>)
                }
            </div>
        </div>
    )
}

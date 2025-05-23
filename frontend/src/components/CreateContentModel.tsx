import { useMutation } from "@tanstack/react-query"
import { CrossIcon } from "../icons/CrossIcon"
import { Button } from "./Button"
import { Input } from "./Input"
import { addContent } from "../api/addcontent"
import { useState, type ChangeEvent } from "react"
import toast from "react-hot-toast"
type onChangeType = ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>

export const CreateContentModel = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const [content, setContent] = useState({
        title: "",
        link: "",
        type: ""
    });
    const selectOptions = [
        {
            value: "youtube",
            title: "Youtube"
        },
        {
            value: "twitter",
            title: "Twitter"
        }
    ]

    const { mutate, isPending } = useMutation({
        mutationFn: addContent,
        onSuccess: (data) => {
            toast.success(data.message)
            onClose()
        },
        onError: () => {
            toast.success("Failed to add content.")
        }
    })

    function handleOnChnage(e: onChangeType) {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }))
    }


    return (
        <div onClick={() => onClose()}>
            {
                open &&
                <div className="w-full h-screen backdrop-blur-[2px] fixed top-0 left-0 flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-slate-100 rounded-md p-2">
                        <div className="flex justify-end items-center mb-4">
                            <div onClick={() => onClose()} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                        </div>
                        <div className="mb-2">
                            <Input
                                placeholder="Title"
                                onChange={handleOnChnage}
                                name={"title"}
                                value={content.title}
                                className="mb-2"
                            />
                            <Input
                                placeholder="Link"
                                onChange={handleOnChnage}
                                name={"link"}
                                value={content.link}
                            />
                            <div className="mt-2 text-slate-600">
                                <label htmlFor="content-type" className="">Content Type</label>
                                <select
                                    id="content-type"
                                    name="type"
                                    value={content.type}
                                    onChange={handleOnChnage}
                                    className="block w-full px-4 py-2 border rounded mt-1 bg-purple-200 text-purple-600"
                                >
                                    {selectOptions.map((op) => (
                                        <option key={op.value} value={op.value}>
                                            {op.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button loading={isPending} onClick={() => {
                                mutate(content)
                                setContent({title:"",link:"",type:""})
                            }} variant="Primary" text="Submit" />
                        </div>
                    </div>
                </div>

            }
        </div>

    )
}

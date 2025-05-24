import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/SideBar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getContent } from "../api/content";
import { createLink } from "../api/createLink";
import toast from "react-hot-toast";
import type { Content } from "../utils/types";


export function Dashboard() {
  const [modelOpen, setModelOpen] = useState<boolean>(false)
  const [contentdata, setContentData] = useState<Content[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "youtube" | "twitter">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ['content'],
    queryFn: getContent
  })

  useEffect(() => {
    if (data) {
      setContentData(data?.content || [])
    }
  }, [data])

  const { mutate } = useMutation({
    mutationFn: createLink,
    onSuccess: ({ hash }) => {
      const url = `http://localhost:5173/brain/${hash}`
      navigator.clipboard.writeText(url);
      toast.success("Link coppied")
    },
    onError: (error: Error) => {
      toast.error("Something went wrong");
      console.error(error)
    }
  })

  const filteredData = activeFilter === "all"
    ? contentdata
    : contentdata.filter(item => item.type === activeFilter);

  return (
    <div className="grid sm:grid-cols-12 ">
      <div className="sm:col-span-2 hidden sm:block">
        <SideBar
          youtube={() => setActiveFilter("youtube")}
          tweet={() => setActiveFilter("twitter")}
          all={() => setActiveFilter("all")}
        />
      </div>
      <div className="col-span-10 p-4 bg-slate-100 w-full">
        <CreateContentModel open={modelOpen} onClose={() => {
          setModelOpen(false)
        }} />

        <div className="flex justify-between items-center mt-2 mb-8">
          <h2 className="font-semibold text-xl">
            {activeFilter === "all" ? "All Notes" :
              activeFilter === "youtube" ? "YouTube Videos" : "Twitter Posts"}
          </h2>
          <div className="flex justify-end items-center gap-4">
            <Button onClick={() => setModelOpen(true)} variant="Primary" text="Add content" startIcon={<PlusIcon />} />
            <Button onClick={() => {
              mutate({ share: true })
            }} variant="Secondary" text="Share brain" startIcon={<ShareIcon />} />
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {
            isLoading && <div>Loading...</div>
          }
          {
            error && <div>Error loading content</div>
          }
          {
            <div className="flex gap-4 flex-wrap">
              {filteredData.length === 0 ? (
                <div className="w-full text-center py-8 text-gray-500">
                  No {activeFilter === "all" ? "" : activeFilter + " "}content found
                </div>
              ) : (
                filteredData.map(({ type, title, link, _id }) => (
                  <Card key={_id} type={type} title={title} link={link} />
                ))
              )}
            </div>
          }
        </div>
      </div>
    </div>
  )
}


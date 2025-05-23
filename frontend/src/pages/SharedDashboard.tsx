import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/Card";
import { SideBar } from "../components/SideBar";
import { sharedBrain } from "../api/sharedBrain";
import type { Content } from "./Dashboard";

export function SharedDashboard() {
    const [contentdata, setContentData] = useState<Content[]>([]);
    const [activeFilter, setActiveFilter] = useState<"all" | "youtube" | "twitter">("all");
    let params = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: [`${params.hash}`],
        queryFn: sharedBrain
    });

    useEffect(() => {
        if (data) {
            setContentData(data?.content || []);
        }
    }, [data]);

    const filteredData = activeFilter === "all" 
        ? contentdata 
        : contentdata.filter(item => item.type === activeFilter);

    return (
        <div className="grid sm:grid-cols-12">
            <div className="sm:col-span-2 hidden sm:block">
                <SideBar 
                    shared={true} 
                    tweet={() => setActiveFilter("twitter")} 
                    youtube={() => setActiveFilter("youtube")}
                    all={() => setActiveFilter("all")}
                />
            </div>
            <div className="col-span-10 p-4 bg-slate-100 w-full">
                <div className="flex justify-between items-center mt-2 mb-8">
                    <h2 className="font-semibold text-xl">
                        {activeFilter === "all" ? "All Notes" : 
                         activeFilter === "youtube" ? "YouTube Videos" : "Twitter Posts"}
                    </h2>
                    {activeFilter !== "all" && (
                        <button 
                            onClick={() => setActiveFilter("all")}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Show all
                        </button>
                    )}
                </div>

                {isLoading && <div className="text-center py-8">Loading...</div>}
                {error && <div className="text-center py-8 text-red-500">Error loading content</div>}

                {!isLoading && !error && (
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
                )}
            </div>
        </div>
    );
}
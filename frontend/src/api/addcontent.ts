import type { ContentData } from "../utils/types";


export async function addContent(data: ContentData) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${String(localStorage.getItem('token'))}` ,
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to add content');
    }

    return await response.json();
}
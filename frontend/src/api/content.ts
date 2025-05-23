import type { QueryKey } from "@tanstack/react-query";

export async function getContent({ queryKey }: { queryKey: QueryKey }) {

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/` + queryKey[0], {
        method: "GET",
        headers: {
            'Authorization': String(localStorage.getItem('token')),
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to add content');
    }

    return await response.json();
}
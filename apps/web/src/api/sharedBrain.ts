import type { QueryKey } from "@tanstack/react-query";

export async function sharedBrain({ queryKey }: { queryKey: QueryKey }) {
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain/` + queryKey[0], {
        method: "GET",
    });
    
    if (!response.ok) {
        throw new Error('Failed to add content');
    }

    return await response.json();
}
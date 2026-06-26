
export async function deleteContent(contentId:string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain/${contentId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${String(localStorage.getItem('token'))}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to add content');
    }

    return await response.json();
}
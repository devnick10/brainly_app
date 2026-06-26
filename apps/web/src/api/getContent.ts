
export async function getContent() {

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${String(localStorage.getItem('token'))}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to add content');
    }

    return await response.json();
}
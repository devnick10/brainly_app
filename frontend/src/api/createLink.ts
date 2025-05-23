type DataType = {
    share : boolean
}
export async function createLink(data: DataType) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain/share`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization':String(localStorage.getItem('token')) ,
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to add content');
    }
    return await response.json();
}

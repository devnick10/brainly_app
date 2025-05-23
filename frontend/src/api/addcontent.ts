interface ContentData {
    title: string;
    link: string;
}

export async function addContent(data: ContentData) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/content`, {
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
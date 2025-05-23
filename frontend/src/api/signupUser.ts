interface UserData {
  email: string;
  password: string;
}

export async function signupUser(data: UserData) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return await response.json();  
}
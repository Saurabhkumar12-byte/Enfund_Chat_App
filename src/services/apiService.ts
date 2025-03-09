export const API_BASE = 'https://chat-api-k4vi.onrender.com';

export const fetchRooms = async () => {
    const response = await fetch(`${API_BASE}/rooms`);
    return await response.json();
};

export const registerUser = async (username: string) => {
    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    return await response.json();
};

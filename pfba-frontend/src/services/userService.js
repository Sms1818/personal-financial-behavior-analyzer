import { getToken } from "./authService";

const API_URL = "http://localhost:8080";

export async function fetchUserProfile() {
    const token = getToken();
    const response = await fetch(`${API_URL}/api/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
        }
        throw new Error("Failed to fetch user profile details.");
    }

    return response.json();
}

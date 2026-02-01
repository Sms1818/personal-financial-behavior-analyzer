import { getToken } from "./authService";

export function getAuthHeaders(isFormData = false) {
    const token = getToken();
    const headers = {};
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}
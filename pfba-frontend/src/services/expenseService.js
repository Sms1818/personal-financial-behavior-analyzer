import { API_BASE_URL } from "../api/config";

export async function fetchExpenses(){
    const response=await fetch(`${API_BASE_URL}/expenses`);
    if(!response.ok){
        throw new Error("Failed to fetch expenses");
    }
    return response.json();
}
import { API_BASE_URL } from "../api/config";

export const getAllInsights= async()=>{
    const response=await fetch(`${API_BASE_URL}/insights`);
    if(!response.ok){
        throw new Error("Failed to fetch the insights");
    }
    return response.json();
}

export const getInsightExplanation= async(insightId)=>{
    const explanation=await fetch(`${API_BASE_URL}/insights/${insightId}/explanation`);
    if (!explanation.ok) {
        throw new Error("Failed to fetch explanation");
      }
    return explanation.json();
}

export async function updateInsightStatus(id,status){
    const res=await fetch(`${API_BASE_URL}/insights/${id}/status`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({status}),
    });
    if(!res.ok){
        throw new Error("Failed to update insight status");
    }
}
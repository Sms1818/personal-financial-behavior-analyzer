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
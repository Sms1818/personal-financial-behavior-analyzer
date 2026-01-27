import { API_BASE_URL } from "../api/config";

/* =======================
   READ
======================= */

export const getAllInsights = async () => {
  const res = await fetch(`${API_BASE_URL}/insights`);
  if (!res.ok) {
    throw new Error("Failed to fetch insights");
  }
  return res.json();
};

export const getInsightExplanation = async insightId => {
  const res = await fetch(
    `${API_BASE_URL}/insights/${insightId}/explanation`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch explanation");
  }

  return res.json();
};

/* =======================
   ACTIONS
======================= */

export const acknowledgeInsight = async id => {
  const res = await fetch(
    `${API_BASE_URL}/insights/${id}/acknowledge`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to acknowledge insight");
  }
};

export const dismissInsight = async id => {
  const res = await fetch(
    `${API_BASE_URL}/insights/${id}/dismiss`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to dismiss insight");
  }
};

export const resolveInsight = async id => {
  const res = await fetch(
    `${API_BASE_URL}/insights/${id}/resolve`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to resolve insight");
  }
};

export const generateInsights = async () => {
  const res=await fetch(
    `${API_BASE_URL}/insights/generate`,
    {
      method: "POST"
    }
  );
  if (!res.ok) {
    throw new Error("Failed to generate insights");
  }
};
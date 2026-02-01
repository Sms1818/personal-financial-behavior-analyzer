import { API_BASE_URL } from "../api/config";
import { getAuthHeaders } from "./apiClient";

export async function fetchExpenses() {
  const response = await fetch(`${API_BASE_URL}/expenses`,{
    headers: getAuthHeaders(false),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

export async function createExpense(expense) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify(expense),
  });
  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
}
export async function updateExpense(id, updatedExpense) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(false),
    body: JSON.stringify(updatedExpense),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    headers: getAuthHeaders(false),
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}

export async function uploadExpenseCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/expenses/import`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  if (!res.ok) {
    throw new Error("CSV upload failed");
  }

  return res.text();
}

import { API_BASE_URL } from "../api/config";

export async function fetchExpenses() {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

export async function createExpense(expense) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedExpense),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
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
    body: formData,
  });
  if (!res.ok) {
    throw new Error("CSV upload failed");
  }

  return res.text();
}

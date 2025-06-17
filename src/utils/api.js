// src/utils/api.js

const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, { method = "GET", body, headers = {}, isFormData = false, ...customConfig } = {}) {
  const token = localStorage.getItem("token");

  // Build headers conditionally
  const configHeaders = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  // If not FormData, set JSON header
  if (!isFormData && !(body instanceof FormData)) {
    configHeaders["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers: configHeaders,
    ...customConfig,
  };

  if (body) {
    config.body = isFormData || body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}

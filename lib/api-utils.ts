// Utility function to get the stored auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null; // Server-side, no access to localStorage
  }
  return localStorage.getItem("admin-access-token");
}

// Utility function to create authenticated fetch headers
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Utility function for authenticated API calls
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

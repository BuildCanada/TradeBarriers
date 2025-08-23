"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored token on mount
    const storedToken = localStorage.getItem("admin-access-token");
    if (storedToken) {
      checkSession(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const checkSession = async (token: string) => {
    try {
      const response = await fetch("/trade-barriers/api/auth/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAccessToken(token);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("admin-access-token");
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error("Session check error:", error);
      localStorage.removeItem("admin-access-token");
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch("/trade-barriers/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    // Store the token and user data
    localStorage.setItem("admin-access-token", data.access_token);
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const signOut = async () => {
    // Clear stored data
    localStorage.removeItem("admin-access-token");
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  plan: "free" | "pro";
  joinedAt: string;
}

interface SavedProject {
  id: string;
  templateId: string;
  templateTitle: string;
  templateShape: string;
  templateGradient: string;
  name: string;
  savedAt: string;
}

interface AuthContextValue {
  user: User | null;
  projects: SavedProject[];
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveProject: (project: Omit<SavedProject, "id" | "savedAt">) => void;
  removeProject: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "em_user";
const PROJECTS_KEY = "em_projects";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    if (storedProjects) setProjects(JSON.parse(storedProjects));
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  };

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const name = email.split("@")[0];
    const u: User = {
      id: crypto.randomUUID(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      avatar: name.slice(0, 2).toUpperCase(),
      plan: "free",
      joinedAt: new Date().toISOString(),
    };
    persist(u);
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const u: User = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: name.slice(0, 2).toUpperCase(),
      plan: "free",
      joinedAt: new Date().toISOString(),
    };
    persist(u);
  }, []);

  const logout = useCallback(() => {
    persist(null);
  }, []);

  const saveProject = useCallback((project: Omit<SavedProject, "id" | "savedAt">) => {
    const newProject: SavedProject = {
      ...project,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    };
    setProjects((prev) => {
      const updated = [newProject, ...prev];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, projects, login, signup, logout, saveProject, removeProject }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

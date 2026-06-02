import { getToken } from "./auth";
import type { LoginResponse } from "./types";

export type Passenger = {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  Cabin: string | null;
  Embarked: string | null;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  init: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (withAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : null) ?? `요청에 실패했어요 (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type UploadResult = {
  count: number;
  preview: Record<string, unknown>[];
};

async function uploadForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { method: "POST", body: formData });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : null) ?? `요청에 실패했어요 (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  uploadCsv: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return uploadForm<UploadResult>("/titanic/james/upload", formData);
  },

  login: (email: string, password: string) =>
    request<LoginResponse>(
      "/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false,
    ),

  signup: (userId: string, password: string, nickname: string, email: string) =>
    request<{ message: string; userId: string; nickname: string; email: string }>(
      "/signup",
      { method: "POST", body: JSON.stringify({ userId, password, nickname, email }) },
      false,
    ),

  chat: (message: string) =>
    request<{ reply?: string; error?: string }>(
      "/chat",
      { method: "POST", body: JSON.stringify({ message }) },
    ),

  passengers: () =>
    request<Passenger[]>("/titanic/walter/passengers"),

  weather: (lat: number, lon: number) =>
    fetch(`/api/weather?lat=${lat}&lon=${lon}`).then((r) => r.json()) as Promise<{
      city?: string;
      temp?: number;
      feels_like?: number;
      description?: string;
      icon?: string;
      humidity?: number;
      error?: string;
    }>,
};

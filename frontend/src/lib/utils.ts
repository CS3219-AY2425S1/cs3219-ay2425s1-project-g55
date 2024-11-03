import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

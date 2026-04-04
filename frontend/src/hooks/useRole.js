"use client";

import { useAuth } from "./useAuth";

export function useRole() {
    const { user } = useAuth();
    const role = user?.role || null;

    return {
        role,
        isAdmin: role === "ADMIN",
        isAnalyst: role === "ANALYST",
        isViewer: role === "VIEWER",
        hasRole: (allowedRole) => role === allowedRole,
    };
}

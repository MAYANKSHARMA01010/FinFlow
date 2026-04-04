"use client";

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMe, logoutUser } from "../api/auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = window.localStorage.getItem("accessToken");

        if (!token) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        getMe()
            .then((response) => {
                const payload = response.data?.data || response.data;

                if (isMounted) {
                    setUser(payload.user || payload);
                }
            })
            .catch(() => {
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("refreshToken");
                window.localStorage.removeItem("user");
                if (isMounted) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const login = ({ accessToken, refreshToken, user: nextUser }) => {
        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("refreshToken", refreshToken || "");
        window.localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch {
            // Ignore logout API errors and clear local session anyway.
        } finally {
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.localStorage.removeItem("user");
            setUser(null);
            toast.success("Logged out successfully");

            setTimeout(() => {
                window.location.href = "/login";
            }, 350);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

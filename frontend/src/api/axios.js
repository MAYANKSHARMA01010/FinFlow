"use client";

import axios from "axios";

const isServer = typeof window === "undefined";
const isProduction = process.env.NODE_ENV === "production";

const baseURL = isServer
    ? isProduction
        ? process.env.NEXT_SERVER_BACKEND_API_URL
        : process.env.NEXT_PUBLIC_BACKEND_API_URL ||
          process.env.NEXT_SERVER_BACKEND_API_URL
        : isProduction
            ? process.env.NEXT_PUBLIC_BACKEND_API_URL_PROD ||
                process.env.NEXT_PUBLIC_BACKEND_API_URL
            : process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && typeof window !== "undefined") {
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;

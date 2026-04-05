"use client";

import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const API_BASE = isProd
    ? process.env.NEXT_PUBLIC_BACKEND_SERVER_URL
    : process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

if (!API_BASE) {
    throw new Error("API base URL is not defined");
}

const api = axios.create({
    baseURL: API_BASE,
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

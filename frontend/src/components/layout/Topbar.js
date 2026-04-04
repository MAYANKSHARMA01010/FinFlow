"use client";

import Badge from "../ui/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar({ title }) {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <Badge tone="info">{user.role}</Badge>
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={logout}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

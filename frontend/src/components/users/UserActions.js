"use client";

export default function UserActions({ user, onChangeRole, onToggleStatus, onDelete }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <select
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-indigo-500"
                value={user.role}
                onChange={(event) => onChangeRole(user.id, event.target.value)}
            >
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
                <option value="VIEWER">VIEWER</option>
            </select>

            <button
                type="button"
                onClick={() => onToggleStatus(user.id, user.status)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
                {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </button>

            <button
                type="button"
                onClick={() => onDelete(user.id)}
                className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600"
            >
                Delete
            </button>
        </div>
    );
}

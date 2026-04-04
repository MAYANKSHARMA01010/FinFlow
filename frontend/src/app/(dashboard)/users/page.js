"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createUser, deleteUser, getUsers, updateUserRole, updateUserStatus } from "../../../api/users.api";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import UsersTable from "../../../components/users/UsersTable";
import { useAuth } from "../../../hooks/useAuth";
import { useRole } from "../../../hooks/useRole";

const initialCreateForm = {
    name: "",
    email: "",
    password: "",
    role: "VIEWER",
    status: "ACTIVE",
};

export default function UsersPage() {
    const router = useRouter();
    const { isLoading } = useAuth();
    const { isAdmin } = useRole();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState(initialCreateForm);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            router.replace("/dashboard");
        }
    }, [isAdmin, isLoading, router]);

    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        let mounted = true;

        async function loadUsers() {
            try {
                const response = await getUsers();
                const payload = response.data?.data || response.data;
                if (mounted) {
                    setUsers(payload.users || payload);
                }
            } catch (requestError) {
                if (mounted) {
                    setError(requestError?.response?.data?.message || "Failed to load users.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            mounted = false;
        };
    }, [isAdmin]);

    const handleChangeRole = async (id, role) => {
        try {
            await updateUserRole(id, { role });
            setUsers((current) => current.map((user) => (user.id === id ? { ...user, role } : user)));
            toast.success("User role updated");
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to update role.";
            setError(message);
            toast.error(message);
        }
    };

    const handleToggleStatus = async (id, status) => {
        const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            await updateUserStatus(id, { status: nextStatus });
            setUsers((current) => current.map((user) => (user.id === id ? { ...user, status: nextStatus } : user)));
            toast.success("User status updated");
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to update status.";
            setError(message);
            toast.error(message);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Delete this user?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteUser(id);
            setUsers((current) => current.filter((user) => user.id !== id));
            toast.success("User deleted");
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to delete user.";
            setError(message);
            toast.error(message);
        }
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();
        setError("");
        setCreating(true);

        try {
            const response = await createUser(createForm);
            const payload = response.data?.data || response.data;
            const nextUser = payload.user || payload;

            setUsers((current) => [nextUser, ...current]);
            setCreateForm(initialCreateForm);
            setShowCreateModal(false);
            toast.success("User created successfully");
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to create user.";
            setError(message);
            toast.error(message);
        } finally {
            setCreating(false);
        }
    };

    if (isLoading || loading) {
        return <div className="h-96 animate-pulse rounded-xl bg-gray-200" />;
    }

    if (!isAdmin) {
        return <EmptyState title="Access denied" description="Only admin users can access the users page." />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                    <p className="text-sm text-gray-500">Manage user roles and account status.</p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    Add User
                </button>
            </div>

            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            {users.length ? (
                <UsersTable
                    users={users}
                    onChangeRole={handleChangeRole}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                />
            ) : (
                <EmptyState title="No users found" description="Seed the database or create users from the backend API." />
            )}

            {showCreateModal ? (
                <Modal title="Add New User" description="Create a new user account with role and status." onClose={() => setShowCreateModal(false)}>
                    <form className="space-y-4" onSubmit={handleCreateUser}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                                value={createForm.name}
                                onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                                type="email"
                                value={createForm.email}
                                onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                                type="password"
                                value={createForm.password}
                                onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                                    value={createForm.role}
                                    onChange={(event) => setCreateForm((current) => ({ ...current, role: event.target.value }))}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="ANALYST">ANALYST</option>
                                    <option value="VIEWER">VIEWER</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                                    value={createForm.status}
                                    onChange={(event) => setCreateForm((current) => ({ ...current, status: event.target.value }))}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70"
                            >
                                {creating ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </div>
    );
}

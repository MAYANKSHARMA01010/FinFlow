import Badge from "../ui/Badge";
import UserActions from "./UserActions";

export default function UsersTable({ users, onChangeRole, onToggleStatus, onDelete }) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                    {(users || []).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                                <Badge tone="info">{user.role}</Badge>
                            </td>
                            <td className="px-4 py-3">
                                <Badge tone={user.status === "ACTIVE" ? "success" : "danger"}>{user.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
                                <UserActions
                                    user={user}
                                    onChangeRole={onChangeRole}
                                    onToggleStatus={onToggleStatus}
                                    onDelete={onDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

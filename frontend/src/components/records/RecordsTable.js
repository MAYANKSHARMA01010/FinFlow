import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function RecordsTable({ records, isAdmin, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Notes</th>
                        {isAdmin ? <th className="px-4 py-3">Actions</th> : null}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                    {(records || []).map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{formatDate(record.date)}</td>
                            <td className="px-4 py-3">
                                <Badge tone={record.type === "INCOME" ? "success" : "danger"}>{record.type}</Badge>
                            </td>
                            <td className="px-4 py-3">{record.category}</td>
                            <td className="px-4 py-3 font-medium">{formatCurrency(record.amount)}</td>
                            <td className="px-4 py-3">{record.notes || "-"}</td>
                            {isAdmin ? (
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(record)}
                                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(record.id)}
                                            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

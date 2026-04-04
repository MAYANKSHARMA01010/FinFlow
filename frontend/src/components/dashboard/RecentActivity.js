import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function RecentActivity({ data }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <p className="text-sm text-gray-500">Last 10 transactions</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                        {(data || []).map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{formatDate(item.date)}</td>
                                <td className="px-4 py-3">{item.category}</td>
                                <td className="px-4 py-3">
                                    <Badge tone={item.type === "INCOME" ? "success" : "danger"}>{item.type}</Badge>
                                </td>
                                <td className="px-4 py-3 font-medium">{formatCurrency(item.amount)}</td>
                                <td className="px-4 py-3">{item.notes || "-"}</td>
                            </tr>
                        ))}
                        {!data?.length ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                                    No recent activity.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

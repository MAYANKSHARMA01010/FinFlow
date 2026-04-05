"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

const initialForm = {
    amount: "",
    type: "INCOME",
    category: "",
    date: "",
    notes: "",
};

export default function RecordForm({ open, record, onClose, onSave, loading }) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (record) {
            setForm({
                amount: record.amount?.toString?.() || record.amount || "",
                type: record.type || "INCOME",
                category: record.category || "",
                date: record.date ? String(record.date).slice(0, 10) : "",
                notes: record.notes || "",
            });
        } else {
            setForm(initialForm);
        }
    }, [record, open]);

    if (!open) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSave(form);
    };

    return (
        <Modal title={record ? "Edit Record" : "Add Record"} onClose={onClose}>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                        type="number"
                        step="0.01"
                        value={form.amount}
                        onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            value={form.type}
                            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                        >
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                        <input
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            value={form.category}
                            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                            placeholder="Food"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                    <input
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                        type="date"
                        value={form.date}
                        onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        className="min-h-24 w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                        value={form.notes}
                        onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                        placeholder="Optional notes"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

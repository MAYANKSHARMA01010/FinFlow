"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    createRecord,
    deleteRecord,
    getRecords,
    updateRecord,
} from "../../../api/records.api";
import { useRole } from "../../../hooks/useRole";
import EmptyState from "../../../components/ui/EmptyState";
import RecordFilters from "../../../components/records/RecordFilters";
import RecordsTable from "../../../components/records/RecordsTable";
import RecordForm from "../../../components/records/RecordForm";

const categories = [
    "Salary",
    "Food",
    "Rent",
    "Travel",
    "Other",
    "Utilities",
    "Entertainment",
    "Freelance",
    "Investment",
    "Healthcare",
];

const initialFilters = {
    type: "",
    category: "",
    startDate: "",
    endDate: "",
};

export default function RecordsPage() {
    const { isAdmin } = useRole();
    const [filters, setFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);
    const [saving, setSaving] = useState(false);

    const queryParams = useMemo(() => {
        const params = {};

        Object.entries(appliedFilters).forEach(([key, value]) => {
            if (value) {
                params[key] = value;
            }
        });

        return params;
    }, [appliedFilters]);

    useEffect(() => {
        let mounted = true;

        async function loadRecords() {
            setLoading(true);
            setError("");

            try {
                const response = await getRecords(queryParams);
                const payload = response.data?.data || response.data;
                if (mounted) {
                    setRecords(payload.records || payload);
                }
            } catch (requestError) {
                if (mounted) {
                    setError(requestError?.response?.data?.message || "Failed to load records.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadRecords();

        return () => {
            mounted = false;
        };
    }, [queryParams]);

    const openCreateModal = () => {
        setActiveRecord(null);
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        setActiveRecord(record);
        setModalOpen(true);
    };

    const handleSave = async (form) => {
        setSaving(true);
        setError("");

        try {
            const payload = {
                amount: Number(form.amount),
                type: form.type,
                category: form.category,
                date: form.date,
                notes: form.notes,
            };

            if (activeRecord) {
                await updateRecord(activeRecord.id, payload);
                toast.success("Record updated");
            } else {
                await createRecord(payload);
                toast.success("Record created");
            }

            setModalOpen(false);
            setActiveRecord(null);
            const response = await getRecords(queryParams);
            const nextData = response.data?.data || response.data;
            setRecords(nextData.records || nextData);
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to save the record.";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Delete this record? This will soft delete it.");
        if (!confirmed) {
            return;
        }

        try {
            await deleteRecord(id);
            setRecords((current) => current.filter((record) => record.id !== id));
            toast.success("Record deleted");
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "Unable to delete the record.";
            setError(message);
            toast.error(message);
        }
    };

    const applyFilters = () => setAppliedFilters(filters);

    const clearFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
    };

    if (loading) {
        return <div className="h-96 animate-pulse rounded-xl bg-gray-200" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Financial Records</h2>
                    <p className="text-sm text-gray-500">View and manage all transactions.</p>
                </div>

                {isAdmin ? (
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Add Record
                    </button>
                ) : null}
            </div>

            <RecordFilters
                filters={filters}
                setFilters={setFilters}
                onApply={applyFilters}
                onClear={clearFilters}
                categories={categories}
            />

            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            {records.length ? (
                <RecordsTable records={records} isAdmin={isAdmin} onEdit={openEditModal} onDelete={handleDelete} />
            ) : (
                <EmptyState title="No records found" description="Adjust the filters or add a new record." />
            )}

            <RecordForm
                open={modalOpen}
                record={activeRecord}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                loading={saving}
            />
        </div>
    );
}

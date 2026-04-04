"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../../api/dashboard.api";
import EmptyState from "../../../components/ui/EmptyState";
import SummaryCards from "../../../components/dashboard/SummaryCards";

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadDashboard() {
            try {
                const summaryRes = await getDashboardSummary();

                if (!mounted) {
                    return;
                }

                const payload = summaryRes.data?.data;
                setSummary(payload?.data || payload || {});
            } catch (requestError) {
                setError(requestError?.response?.data?.message || "Failed to load dashboard data.");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4">
                <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Dashboard unavailable" description={error} />;
    }

    return (
        <div className="space-y-6">
            <SummaryCards summary={summary} />

            <div className="grid gap-4 xl:grid-cols-2">
                <SectionSkeleton
                    title="Monthly Trends"
                    description="Chart structure reserved for upcoming income and expense trends."
                    heightClassName="h-80"
                />
                <SectionSkeleton
                    title="Category Breakdown"
                    description="This section will show category-level spending and income distribution."
                    heightClassName="h-80"
                />
            </div>

            <SectionSkeleton
                title="Recent Activity"
                description="Latest transactions will appear here once the section is enabled."
                heightClassName="h-96"
                tablePreview
            />
        </div>
    );
}

function SectionSkeleton({ title, description, heightClassName, tablePreview = false }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                    Coming soon
                </span>
            </div>

            <div className={`mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 ${heightClassName} animate-pulse`}>
                {tablePreview ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-5 gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-5 gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                            <div className="h-3 rounded bg-gray-200" />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="w-full max-w-md space-y-4">
                            <div className="h-40 rounded-2xl bg-white shadow-sm" />
                            <div className="grid grid-cols-3 gap-3">
                                <div className="h-3 rounded bg-white shadow-sm" />
                                <div className="h-3 rounded bg-white shadow-sm" />
                                <div className="h-3 rounded bg-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

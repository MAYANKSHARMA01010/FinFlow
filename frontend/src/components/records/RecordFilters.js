export default function RecordFilters({ filters, setFilters, onApply, onClear, categories }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={filters.type}
                    onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
                >
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

                <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={filters.category}
                    onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    type="date"
                    value={filters.startDate}
                    onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                />

                <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    type="date"
                    value={filters.endDate}
                    onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                />

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onApply}
                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Apply Filters
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

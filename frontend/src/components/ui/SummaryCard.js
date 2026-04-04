export default function SummaryCard({ label, value, accent = "indigo" }) {
    const accents = {
        indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
        green: "border-green-200 bg-green-50 text-green-700",
        red: "border-red-200 bg-red-50 text-red-700",
        blue: "border-blue-200 bg-blue-50 text-blue-700",
    };

    return (
        <div className={`rounded-xl border p-6 shadow-sm ${accents[accent] || accents.indigo}`}>
            <div className="text-sm font-medium opacity-80">{label}</div>
            <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

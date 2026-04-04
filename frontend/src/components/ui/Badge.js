export default function Badge({ children, tone = "neutral", className = "" }) {
    const tones = {
        neutral: "bg-gray-100 text-gray-700",
        success: "bg-green-100 text-green-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-indigo-100 text-indigo-700",
        warning: "bg-yellow-100 text-yellow-700",
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.neutral} ${className}`}>
            {children}
        </span>
    );
}

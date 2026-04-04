export default function EmptyState({ title, description, action }) {
    return (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}

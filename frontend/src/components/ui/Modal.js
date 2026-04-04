"use client";

export default function Modal({ title, description, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

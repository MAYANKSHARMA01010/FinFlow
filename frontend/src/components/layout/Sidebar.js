"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "../../hooks/useRole";

const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/records", label: "Records" },
    { href: "/users", label: "Users", adminOnly: true },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isAdmin } = useRole();

    return (
        <aside className="flex h-full w-64 flex-col border-r border-gray-800 bg-gray-900 text-white">
            <div className="border-b border-gray-800 px-6 py-5">
                <div className="text-2xl font-semibold">FinFlow</div>
                <p className="mt-1 text-xs text-gray-400">Finance dashboard</p>
            </div>

            <nav className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {navItems
                        .filter((item) => !item.adminOnly || isAdmin)
                        .map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${active ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                </div>
            </nav>
        </aside>
    );
}

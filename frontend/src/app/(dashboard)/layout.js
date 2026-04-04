"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { useAuth } from "../../hooks/useAuth";

const titles = {
  "/dashboard": "Dashboard",
  "/records": "Financial Records",
  "/users": "Users",
};

function getTitle(pathname) {
  if (pathname?.startsWith("/dashboard")) return titles["/dashboard"];
  if (pathname?.startsWith("/records")) return titles["/records"];
  if (pathname?.startsWith("/users")) return titles["/users"];
  return "FinFlow";
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={getTitle(pathname)} />
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

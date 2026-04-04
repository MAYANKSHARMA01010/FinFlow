"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(user ? "/dashboard" : "/login");
  }, [isLoading, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-500">Loading FinFlow...</div>
    </div>
  );
}

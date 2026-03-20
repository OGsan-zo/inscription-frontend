'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import AdminMatieresView from "@/features/notes/components/AdminMatieresView";
import { User } from "@/lib/db";

export default function NotesAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push(login);
        return;
      }
      const data = await res.json();
      if (data.user?.role !== 'Admin') {
        router.push(login);
        return;
      }
      setUser(data.user);
    };
    checkAuth();
  }, [login, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Menu user={user} />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <AdminMatieresView />
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import ProfesseurView from "@/features/notes/components/professeur/ProfesseurView";
import { User } from "@/lib/db";

export default function ProfesseurPage() {
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
      if (data.user?.role !== 'Professeur') {
        router.push(login);
        return;
      }
      setUser(data.user);
    };
    checkAuth();
  }, [login, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Menu user={user} />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <ProfesseurView />
        </div>
      </div>
    </div>
  );
}

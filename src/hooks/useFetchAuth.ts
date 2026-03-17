"use client"; // 👈 Indispensable pour utiliser useRouter dans Next.js App Router


export function useFetchAuth() {

    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const response = await fetch(url, options);

        if (response.status === 401 || response.status === 403) {
            if (typeof window !== "undefined") {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = login;
            }
            throw new Error("Non autorisé, redirection en cours...");
        }

        return response;
    };

    return fetchWithAuth;
}
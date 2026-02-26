"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';


type AuthContextValue = {
    isAuthenticated: boolean;
    isHydrated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}

const PASSWORD = "veggierescue2026";

export function AuthProvider({children}: {children: React.ReactNode}) {
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const[isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("isAuthenticated");
        setIsAuthenticated(stored === "true");
        setIsHydrated(true);
    }, []);

    const login = (password: string) => {
        const trimmed = password.trim();
        const ok = trimmed === PASSWORD;
        if (!ok) return false;
        setIsAuthenticated(true);
        sessionStorage.setItem("isAuthenticated", "true");
        return true;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem(PASSWORD);
    };
    const value = useMemo(() => ({
        isAuthenticated, isHydrated, login, logout
    }), [isAuthenticated, isHydrated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};



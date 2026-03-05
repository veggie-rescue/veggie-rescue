"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';


type AuthContextValue = {
    isAuthenticated: boolean;
    isHydrated: boolean;
    login: (accessCode: string) => boolean;
    logout: () => void;
};

const ACCESS_CODE_KEY = "accessCode";
const AUTH_FLAG_KEY = "isAuthenticated";

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const[isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const authFlag = sessionStorage.getItem(AUTH_FLAG_KEY) === "true";
        const storedAccessCode = localStorage.getItem(ACCESS_CODE_KEY);

        setIsAuthenticated(authFlag && Boolean(storedAccessCode));
        setIsHydrated(true);
    }, []);

    const login = (accessCode: string) => {
        const trimmed = accessCode.trim();
        const ok = trimmed === accessCode;
        if (!ok) return false;

        sessionStorage.setItem(AUTH_FLAG_KEY, "true");
        localStorage.setItem(ACCESS_CODE_KEY, trimmed);
        setIsAuthenticated(true);

        return true;
    };

    const logout = () => {
        sessionStorage.removeItem(AUTH_FLAG_KEY);
        localStorage.removeItem(ACCESS_CODE_KEY)
        setIsAuthenticated(false);
    };

    const getAccessCode = (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(ACCESS_CODE_KEY);
    };

    const value = useMemo(() => ({
        isAuthenticated, isHydrated, login, logout, getAccessCode,
    }), [isAuthenticated, isHydrated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};



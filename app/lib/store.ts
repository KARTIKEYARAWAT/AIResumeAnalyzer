import { create } from "zustand";
import { supabase } from "./supabase";

interface AppUser {
    id: string;
    username: string;
    email: string;
}

interface AppStore {
    isLoading: boolean;
    error: string | null;
    puterReady: boolean;
    analysisResult: Feedback | null;
    setAnalysisResult: (result: Feedback | null) => void;
    auth: {
        user: AppUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => AppUser | null;
    };
    init: () => void;
    clearError: () => void;
}

export const useAppStore = create<AppStore>((set, get) => {
    const setError = (msg: string) => {
        set({ error: msg, isLoading: false });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        // Bypass Supabase Auth completely. Use a local guest session.
        let guestId = localStorage.getItem('guest_user_id');
        if (!guestId) {
            guestId = crypto.randomUUID ? crypto.randomUUID() : `guest-${Date.now()}`;
            localStorage.setItem('guest_user_id', guestId);
        }

        const user = {
            id: guestId,
            username: "Guest",
            email: "guest@airesume.ai",
        };
        
        set((state) => ({
            auth: { ...state.auth, user, isAuthenticated: true },
            isLoading: false,
            puterReady: true
        }));
        
        return true;
    };

    const signIn = async (): Promise<void> => {
        await checkAuthStatus();
    };

    const signOut = async (): Promise<void> => {
        localStorage.removeItem('guest_user_id');
        set((state) => ({
            auth: { ...state.auth, user: null, isAuthenticated: false },
            isLoading: false,
        }));
    };

    const refreshUser = async (): Promise<void> => {
        await checkAuthStatus();
    };

    const init = (): void => {
        checkAuthStatus();
    };

    return {
        isLoading: false,
        error: null,
        puterReady: true,
        analysisResult: null,
        setAnalysisResult: (result: Feedback | null) => set({ analysisResult: result }),
        auth: {
            user: null,
            isAuthenticated: false, // Will be set to true instantly on init
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        init,
        clearError: () => set({ error: null }),
    };
});

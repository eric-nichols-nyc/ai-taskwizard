import { create } from "zustand";
import { signInWithGoogle } from '@turbo-with-tailwind-v4/database';

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore & { fetchAndSetUser: () => Promise<void> }>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    fetchAndSetUser: async () => {
        const session = await signInWithGoogle();
        if (session && session.user) {
            set({ user: {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email || '',
                email: session.user.email || ''
            }});
        }
    }
}));
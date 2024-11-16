import { create } from "zustand";
import { User } from "./types";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;

  initUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  initUser: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(user);
        const user = {
          id: data._id,
          email: data.email,
          userName: data.userName,
        };

        set({ user });
      }
    } catch (error) {
      set({ user: null });
    }
  },
}));

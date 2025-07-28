import { create } from "zustand";
import { type User } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const initialState: UserState = {
  user: null,
  setUser: () => {},
};

const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
}));

export default useUserStore;

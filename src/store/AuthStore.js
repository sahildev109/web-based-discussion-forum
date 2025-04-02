import { create } from "zustand";

const AuthStore = create((set) => ({
    
	user: JSON.parse(localStorage.getItem("user-info")),
	login: (user) => set({ user }),
	logout: () => set({ user: null }),
	setUser: (user) => set({ user }),
}));

export default AuthStore;
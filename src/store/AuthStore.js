import { create } from "zustand";

const AuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info")),

  login: (user) => set({ user }),

  logout: () => set({ user: null }),

  setUser: (user) => set({ user }),

  updateOutgoing: (receiverId) =>
    set((state) => {
      const currentUser = state.user;

      // Ensure friendRequests and outgoing arrays exist
      const updatedUser = {
        ...currentUser,
        friendRequests: {
          ...currentUser.friendRequests,
          outgoing: [
            ...(currentUser.friendRequests?.outgoing || []),
            receiverId,
          ],
        },
      };

      // Update localStorage too (to persist across reload)
      localStorage.setItem("user-info", JSON.stringify(updatedUser));

      return { user: updatedUser };
    }),
}));

export default AuthStore;

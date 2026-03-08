import { create } from "zustand";

// Helper function to generate guest user
const generateGuestUser = () => {
  const guestId = `guest_${Math.random().toString(36).substring(2, 11)}`;
  const guestNumber = Math.floor(Math.random() * 9999);
  return {
    _id: guestId,
    name: `Guest${guestNumber}`,
    email: null,
    isGuest: true,
  };
};

// Initialize guest user immediately
const initialUser = generateGuestUser();

export const useUserStore = create((set) => ({
  user: initialUser,
  regenerateUser: () => {
    set({ user: generateGuestUser() });
  },
}));

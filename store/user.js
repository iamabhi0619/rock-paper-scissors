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

// Get initial user from localStorage or generate new one
const getInitialUser = () => {
  if (typeof window !== "undefined") {
    const savedName = localStorage.getItem("userName");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedName && savedUserId) {
      return {
        _id: savedUserId,
        name: savedName,
        email: null,
        isGuest: true,
      };
    }
  }
  
  const newUser = generateGuestUser();
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", newUser._id);
    localStorage.setItem("userName", newUser.name);
  }
  return newUser;
};

// Initialize guest user
const initialUser = getInitialUser();

export const useUserStore = create((set) => ({
  user: initialUser,
  regenerateUser: () => {
    set({ user: generateGuestUser() });
  },
  setUserName: (name) => {
    set((state) => {
      const newName = name.trim() || state.user.name;
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", newName);
      }
      return {
        user: {
          ...state.user,
          name: newName,
        },
      };
    });
  },
}));

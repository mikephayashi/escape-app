"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userName: string | null;
  userImage: string | null;
  setUser: (name: string, image: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedImage = localStorage.getItem("userImage");
    if (storedName) setUserName(storedName);
    if (storedImage) setUserImage(storedImage);
  }, []);

  const setUser = (name: string, image: string) => {
    setUserName(name);
    setUserImage(image);
    localStorage.setItem("userName", name);
    localStorage.setItem("userImage", image);
  };

  const clearUser = () => {
    setUserName(null);
    setUserImage(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
  };

  return (
    <UserContext.Provider value={{ userName, userImage, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}


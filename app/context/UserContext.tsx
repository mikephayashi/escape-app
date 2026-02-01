"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userName: string | null;
  userImage: string | null;
  isConfirmed: boolean;
  hasUploadedPhoto: boolean;
  uploadFailed: boolean;
  setUser: (name: string, image: string) => void;
  clearUser: () => void;
  markPhotoUploaded: () => void;
  markUploadFailed: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasUploadedPhoto, setHasUploadedPhoto] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedImage = localStorage.getItem("userImage");
    const storedConfirmed = localStorage.getItem("userConfirmed");
    const storedPhotoUploaded = localStorage.getItem("hasUploadedPhoto");
    const storedUploadFailed = localStorage.getItem("uploadFailed");
    if (storedName) setUserName(storedName);
    if (storedImage) setUserImage(storedImage);
    if (storedConfirmed === "true") setIsConfirmed(true);
    if (storedPhotoUploaded === "true") setHasUploadedPhoto(true);
    if (storedUploadFailed === "true") setUploadFailed(true);
  }, []);

  const setUser = (name: string, image: string) => {
    setUserName(name);
    setUserImage(image);
    setIsConfirmed(true);
    localStorage.setItem("userName", name);
    localStorage.setItem("userImage", image);
    localStorage.setItem("userConfirmed", "true");
  };

  const clearUser = () => {
    setUserName(null);
    setUserImage(null);
    setIsConfirmed(false);
    setHasUploadedPhoto(false);
    setUploadFailed(false);
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userConfirmed");
    localStorage.removeItem("hasUploadedPhoto");
    localStorage.removeItem("uploadFailed");
  };

  const markPhotoUploaded = () => {
    setHasUploadedPhoto(true);
    setUploadFailed(false);
    localStorage.setItem("hasUploadedPhoto", "true");
    localStorage.removeItem("uploadFailed");
  };

  const markUploadFailed = () => {
    setUploadFailed(true);
    localStorage.setItem("uploadFailed", "true");
  };

  return (
    <UserContext.Provider value={{ userName, userImage, isConfirmed, hasUploadedPhoto, uploadFailed, setUser, clearUser, markPhotoUploaded, markUploadFailed }}>
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

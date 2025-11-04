"use client";

import { useState, useEffect, useCallback } from "react";

const RECRUITER_MODE_KEY = "recruiter-mode";
const RECRUITER_REFERRERS = [
  "linkedin",
  "indeed",
  "wellfound",
  "ziprecruiter",
  "glassdoor",
];

export function useRecruiterMode() {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check if referrer indicates recruiter
  const checkReferrer = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    const referrer = document.referrer.toLowerCase();
    return RECRUITER_REFERRERS.some((site) => referrer.includes(site));
  }, []);

  // Check URL query param
  const checkUrlParam = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    const params = new URLSearchParams(window.location.search);
    return params.get("recruiter") === "true";
  }, []);

  // Load from localStorage
  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    const stored = localStorage.getItem(RECRUITER_MODE_KEY);
    return stored === "true";
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((value: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(RECRUITER_MODE_KEY, value.toString());
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Priority: URL param > Referrer > LocalStorage
    const urlParam = checkUrlParam();
    const referrer = checkReferrer();
    const stored = loadFromStorage();

    const shouldActivate = urlParam || referrer || stored;
    
    if (shouldActivate) {
      setIsRecruiterMode(true);
      if (urlParam || referrer) {
        saveToStorage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcut handler (Shift+R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "R") {
        e.preventDefault();
        toggleRecruiterMode(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecruiterMode]);

  const toggleRecruiterMode = useCallback(
    (showNotification = false) => {
      const newValue = !isRecruiterMode;
      setIsRecruiterMode(newValue);
      saveToStorage(newValue);

      if (showNotification) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    },
    [isRecruiterMode, saveToStorage]
  );

  return {
    isRecruiterMode,
    toggleRecruiterMode,
    showToast,
  };
}


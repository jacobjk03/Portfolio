"use client";

import { useState, useCallback } from "react";
import { RESUME_FILE_NAME, RESUME_URL } from "@/config/resume-data";

interface DownloadOptions {
  showToast?: (message: string, position: { x: number; y: number }) => void;
  onSuccess?: () => void;
  delay?: number;
  clickPosition?: { x: number; y: number };
}

export function useResumeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const downloadResume = useCallback(
    async (options: DownloadOptions = {}) => {
      const { showToast, onSuccess, delay = 400, clickPosition } = options;

      if (isDownloading) return;

      setIsDownloading(true);

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Show toast if provided (position near click or button center)
      if (showToast && !prefersReducedMotion && clickPosition) {
        showToast("Preparing secure file packet...", clickPosition);
      }

      // Delay for cinematic feel (unless reduced motion)
      if (!prefersReducedMotion && delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      try {
        // Create a link element for download
        const link = document.createElement("a");
        link.href = RESUME_URL;
        link.download = RESUME_FILE_NAME;
        link.setAttribute("download", RESUME_FILE_NAME);
        
        // Force download (not open in browser)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success badge
        if (!prefersReducedMotion) {
          setShowSuccessBadge(true);
          setTimeout(() => {
            setShowSuccessBadge(false);
          }, 2000);
        }

        onSuccess?.();
      } catch (error) {
        console.error("Failed to download resume:", error);
        // Fallback: open in new tab
        window.open(RESUME_URL, "_blank");
      } finally {
        setIsDownloading(false);
      }
    },
    [isDownloading]
  );

  return {
    downloadResume,
    isDownloading,
    showSuccessBadge,
  };
}


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FootageRedirect: React.FC = () => {
  const navigate = useNavigate();
  const driveUrl = "https://drive.google.com/drive/folders/1PluDG_TcnvSxsJtdBJauCgU2jqcrUccg?usp=sharing";

  useEffect(() => {
    // This handles both direct navigation to /footage and clicking the navbar link
    try {
      // Try to open the Google Drive link in a new tab
      const newWindow = window.open(driveUrl, "_blank", "noopener,noreferrer");

      // If popup was blocked or failed, provide a fallback
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn("Popup blocked or failed to open. Redirecting in current tab.");
        window.location.href = driveUrl;
        return;
      }
    } catch (error) {
      console.error("Error opening new window:", error);
      // Fallback to redirecting in the current tab
      window.location.href = driveUrl;
      return;
    }

    // Navigate back to home page if the new tab was successfully opened
    navigate("/", { replace: true });
  }, [navigate, driveUrl]);

  return null;
};

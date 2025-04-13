import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FootageRedirect: React.FC = () => {
  const navigate = useNavigate();
  const driveUrl = "https://drive.google.com/drive/folders/1PluDG_TcnvSxsJtdBJauCgU2jqcrUccg?usp=sharing";

  useEffect(() => {
    // Open the Google Drive link in a new tab
    window.open(driveUrl, "_blank", "noopener,noreferrer");
    
    // Navigate back to home page
    navigate("/", { replace: true });
  }, [navigate, driveUrl]);

  return null;
};

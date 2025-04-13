import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SubmitContactRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/submit-network", { replace: true });
  }, [navigate]);

  return null;
};

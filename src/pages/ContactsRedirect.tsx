import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ContactsRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/network", { replace: true });
  }, [navigate]);

  return null;
};

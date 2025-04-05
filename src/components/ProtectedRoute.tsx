import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useLoginModal } from "../App";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // If not authenticated, show the login modal
    if (!isAuthenticated && !showLoginPrompt) {
      setShowLoginPrompt(true);
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal, showLoginPrompt]);

  // If authenticated, render the protected component
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to home
  return <Navigate to="/" replace />;
};

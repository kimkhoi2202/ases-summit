import React, { useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from "@heroui/react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { LoginModal } from "./components/login-modal";
import { useAuth } from "./context/auth-context";
import { OrganizerView } from "./components/organizer-view";
import { Home } from "./pages/Home";
import { Stanford } from "./pages/Stanford";

interface NavbarComponentProps {
  setLoginOpen: (isOpen: boolean) => void;
}

const NavbarComponent: React.FC<NavbarComponentProps> = ({ setLoginOpen }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <Navbar className="bg-white border-b border-divider">
      <NavbarBrand>
        <RouterLink to="/">
          <img
            src="https://images.typeform.com/images/LFhGhnmKWCkr/image/default"
            alt="ASES Summit Logo"
            className="h-12 md:h-16 lg:h-20 w-auto object-contain"
          />
        </RouterLink>
      </NavbarBrand>
      <NavbarContent className="gap-4" justify="center">
        <NavbarItem isActive={location.pathname === "/"}>
          <Link as={RouterLink} to="/" color={location.pathname === "/" ? "primary" : "foreground"}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/stanford"}>
          <Link as={RouterLink} to="/stanford" color={location.pathname === "/stanford" ? "primary" : "foreground"}>
            Stanford
          </Link>
        </NavbarItem>
        {isAuthenticated && (
          <NavbarItem isActive={location.pathname === "/organizer"}>
            <Link as={RouterLink} to="/organizer" color={location.pathname === "/organizer" ? "primary" : "foreground"}>
              Organizer Tools
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {isAuthenticated ? (
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            variant="solid"
            onPress={logout}
          >
            Log Out
          </Button>
        ) : (
          <Button
            className="bg-[#6abcff] text-black hover:bg-[#5aa6e6]"
            variant="solid"
            onPress={() => setLoginOpen(true)}
          >
            Organizers Log In
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  setLoginOpen: (isOpen: boolean) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, setLoginOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Show login modal
      setLoginOpen(true);
      // Redirect to home after a short delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, setLoginOpen]);

  return isAuthenticated ? <>{children}</> : null;
};

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the organizer page and not authenticated
  useEffect(() => {
    if (location.pathname === '/organizer' && !isAuthenticated) {
      setIsLoginOpen(true);
    }
  }, [location.pathname, isAuthenticated]);

  // Redirect to organizer page if user is already authenticated
  useEffect(() => {
    // Only redirect if they're not already on the organizer page
    if (isAuthenticated && location.pathname !== '/organizer') {
      navigate('/organizer');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <main className="min-h-screen bg-background">
      <NavbarComponent setLoginOpen={setIsLoginOpen} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stanford" element={<Stanford />} />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} setLoginOpen={setIsLoginOpen}>
              <OrganizerView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


import React, { useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { LoginModal } from "./components/login-modal";
import { useAuth } from "./context/auth-context";
import { OrganizerView } from "./components/organizer-view";
import { Home } from "./pages/Home";
import { Stanford } from "./pages/Stanford";
import { Workshop2 } from "./pages/Workshop2";
import { SamAhmed } from "./pages/SamAhmed";
import { RyanChiang } from "./pages/RyanChiang";

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
        <NavbarItem isActive={location.pathname === "/workshop-2"}>
          <Link as={RouterLink} to="/workshop-2" color={location.pathname === "/workshop-2" ? "primary" : "foreground"}>
            Workshop 2
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem isActive={location.pathname.includes("/speaker")}>
            <DropdownTrigger>
              <Link
                className="flex items-center gap-1 cursor-pointer"
                color={location.pathname.includes("/speaker") ? "primary" : "foreground"}
              >
                Speaker
                <span className="text-xs">▼</span>
              </Link>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Speaker options">
            <DropdownItem key="sam-ahmed">
              <Link as={RouterLink} to="/speaker/sam-ahmed" className="w-full">
                Sam Ahmed (thestoicteacher)
              </Link>
            </DropdownItem>
            <DropdownItem key="ryan-chiang">
              <Link as={RouterLink} to="/speaker/ryan-chiang" className="w-full">
                Ryan Chiang (EssaysThatWorked)
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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

  // Check if we're on the organizer page and not authenticated
  useEffect(() => {
    if (location.pathname === '/organizer' && !isAuthenticated) {
      setIsLoginOpen(true);
    }
  }, [location.pathname, isAuthenticated]);

  // We're removing the automatic redirection for authenticated users
  // This allows them to freely navigate between pages after login

  return (
    <main className="min-h-screen bg-background">
      <NavbarComponent setLoginOpen={setIsLoginOpen} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stanford" element={<Stanford />} />
        <Route path="/workshop-2" element={<Workshop2 />} />
        <Route path="/speaker/sam-ahmed" element={<SamAhmed />} />
        <Route path="/speaker/ryan-chiang" element={<RyanChiang />} />
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


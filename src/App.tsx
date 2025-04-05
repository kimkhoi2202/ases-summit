import React, { createContext, useContext } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from "@heroui/react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation } from "react-router-dom";
import { LoginModal } from "./components/login-modal";
import { useAuth } from "./context/auth-context";
import { OrganizerView } from "./components/organizer-view";
import { Home } from "./pages/Home";
import { Stanford } from "./pages/Stanford";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Create a context for the login modal
interface LoginModalContextType {
  openLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
  openLoginModal: () => {}
});

export const useLoginModal = () => useContext(LoginModalContext);

const NavbarComponent = () => {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const openLoginModal = () => {
    setIsLoginOpen(true);
  };

  return (
    <LoginModalContext.Provider value={{ openLoginModal }}>
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
              onPress={openLoginModal}
            >
              Organizers Log In
            </Button>
          )}
        </NavbarContent>
      </Navbar>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </LoginModalContext.Provider>
  );
};

export default function App() {
  return (
    <Router>
      <main className="min-h-screen bg-background">
        <NavbarComponent />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stanford" element={<Stanford />} />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute>
                <OrganizerView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}


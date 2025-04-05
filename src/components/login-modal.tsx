import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleLogin = () => {
    setError("");
    if (username === import.meta.env.VITE_AUTH_USERNAME && password === import.meta.env.VITE_AUTH_PASSWORD) {
      login();
      onClose();
      // Redirect to organizer page after successful login
      navigate("/organizer");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Organizers Login
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onValueChange={setUsername}
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onValueChange={setPassword}
                />
                {error && <p className="text-danger text-sm">{error}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleLogin}>
                Login
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


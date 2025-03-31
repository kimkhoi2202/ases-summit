import React from "react";
import { Tabs, Tab, Card, CardBody, Navbar, NavbarBrand, NavbarContent, Button } from "@heroui/react";
import { Hero } from "./components/hero";
import { LoginModal } from "./components/login-modal";
import { useAuth } from "./context/auth-context";
import { OrganizerView } from "./components/organizer-view";

export default function App() {
  const [selected, setSelected] = React.useState("schedule");
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleTabChange = (key: string | number) => {
    setSelected(key.toString());
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar className="bg-white border-b border-divider">
        <NavbarBrand>
          <img 
            src="https://images.typeform.com/images/LFhGhnmKWCkr/image/default" 
            alt="ASES Summit Logo" 
            className="h-20"
          />
        </NavbarBrand>
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
              className="bg-[#6abcff] text-white hover:bg-[#5aa6e6]"
              variant="solid" 
              onPress={() => setIsLoginOpen(true)}
            >
              Organizers Log In
            </Button>
          )}
        </NavbarContent>
      </Navbar>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      <Hero />
      
      {isAuthenticated ? (
        <OrganizerView />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Card className="shadow-none">
            <CardBody className="p-0">
              <Tabs 
                aria-label="ASES Summit Information" 
                selectedKey={selected} 
                onSelectionChange={handleTabChange}
                variant="underlined"
                color="primary"
                className="w-full"
              >
                <Tab key="schedule" title="Event Schedule">
                  <div className="p-4">
                    <iframe 
                      className="airtable-embed w-full" 
                      src="https://airtable.com/embed/app67Fth4y8jbCRQu/shr5bxMS9uTsXBcCe?viewControls=on" 
                      frameBorder="0" 
                      width="100%" 
                      height="1066" 
                      style={{ background: "transparent", border: "1px solid #ccc" }}
                      title="ASES Summit Schedule"
                    ></iframe>
                  </div>
                </Tab>
                <Tab key="speakers" title="Speaker Database">
                  <div className="p-4">
                    <iframe 
                      className="airtable-embed w-full" 
                      src="https://airtable.com/embed/app67Fth4y8jbCRQu/shr9WlgbambUFypgR" 
                      frameBorder="0" 
                      width="100%" 
                      height="1066" 
                      style={{ background: "transparent", border: "1px solid #ccc" }}
                      title="ASES Summit Speakers"
                    ></iframe>
                  </div>
                </Tab>
                <Tab key="questions" title="Submit Questions">
                  <div className="p-4">
                    <iframe 
                      className="airtable-embed w-full" 
                      src="https://airtable.com/embed/app67Fth4y8jbCRQu/pagwRC1DkL39J666W/form" 
                      frameBorder="0" 
                      width="100%" 
                      height="1066" 
                      style={{ background: "transparent", border: "1px solid #ccc" }}
                      title="ASES Summit Questions"
                    ></iframe>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      )}
    </main>
  );
}


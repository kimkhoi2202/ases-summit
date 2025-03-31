import React, { Key } from "react";
import { Tabs, Tab, Card, CardBody, Navbar, NavbarBrand } from "@heroui/react";
import { Hero } from "./components/hero";

export default function App() {
  const [selected, setSelected] = React.useState("schedule");

  const handleSelectionChange = (key: Key) => {
    setSelected(String(key));
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar className="bg-white border-b border-divider">
        <NavbarBrand>
          <img 
            src="https://images.typeform.com/images/LFhGhnmKWCkr/image/default" 
            alt="ASES Summit Logo" 
            className="h-20" // Increased from h-10 to h-20 (twice as big)
          />
        </NavbarBrand>
      </Navbar>
      
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-none">
          <CardBody className="p-0">
            <Tabs 
              aria-label="ASES Summit Information" 
              selectedKey={selected} 
              onSelectionChange={handleSelectionChange}
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
    </main>
  );
}


import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Hero } from "../components/hero";

export const Home: React.FC = () => {
  const [selected, setSelected] = React.useState("schedule");

  const handleTabChange = (key: string | number) => {
    setSelected(key.toString());
  };

  return (
    <>
      <Hero />
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
                    style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1066px" }}
                    title="ASES Summit Schedule"
                  ></iframe>
                </div>
              </Tab>
              <Tab key="speakers" title="Speaker Database">
                <div className="p-4">
                  <iframe
                    className="airtable-embed w-full"
                    src="https://airtable.com/embed/app67Fth4y8jbCRQu/shr9WlgbambUFypgR"
                    style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1066px" }}
                    title="ASES Summit Speakers"
                  ></iframe>
                </div>
              </Tab>
              <Tab key="questions" title="Submit Questions">
                <div className="p-4">
                  <iframe
                    className="airtable-embed w-full"
                    src="https://airtable.com/embed/app67Fth4y8jbCRQu/pagwRC1DkL39J666W/form"
                    style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1066px" }}
                    title="ASES Summit Questions"
                  ></iframe>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

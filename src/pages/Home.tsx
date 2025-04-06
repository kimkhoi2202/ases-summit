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

                  <div className="mt-6 p-5 border border-blue-100 rounded-lg bg-blue-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">📅 Add to your calendar</h3>
                      <p className="text-sm text-blue-600 mt-1">Subscribe to the event schedule in your favorite calendar app</p>
                    </div>
                    <div className="relative w-full sm:w-auto mt-3 sm:mt-0">
                      <div className="flex">
                        <input
                          type="text"
                          readOnly
                          value="https://airtable.com/app67Fth4y8jbCRQu/shr5bxMS9uTsXBcCe/iCal?timeZone=America%2FLos_Angeles&userLocale=en"
                          className="w-full sm:w-96 py-2 px-3 border border-blue-200 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                          onClick={() => {
                            navigator.clipboard.writeText("https://airtable.com/app67Fth4y8jbCRQu/shr5bxMS9uTsXBcCe/iCal?timeZone=America%2FLos_Angeles&userLocale=en");
                            const button = document.getElementById('copy-button');
                            if (button) {
                              const originalText = button.textContent;
                              button.textContent = '✓ Copied!';
                              setTimeout(() => {
                                button.textContent = originalText;
                              }, 2000);
                            }
                          }}
                          id="copy-button"
                        >
                          Copy Link
                        </button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">Click to select, then copy the link or use the Copy button</p>
                    </div>
                  </div>
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

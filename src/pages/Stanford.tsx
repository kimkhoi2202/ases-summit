import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Hero } from "../components/hero";

export const Stanford: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-none">
          <CardBody className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2">
                <iframe
                  className="airtable-embed"
                  src="https://airtable.com/embed/app67Fth4y8jbCRQu/shrrEMq9bftlMsUIG"
                  style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1000px" }}
                  title="Stanford Left Embed"
                ></iframe>
              </div>
              <div className="p-2">
                <iframe
                  className="airtable-embed"
                  src="https://airtable.com/embed/app67Fth4y8jbCRQu/pagoHb7Vfq85WGHAm/form"
                  style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1000px" }}
                  title="Stanford Right Embed"
                ></iframe>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

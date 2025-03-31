import React from "react";
import { Card, CardBody } from "@heroui/react";

export const OrganizerView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Organizers Dashboard</h2>
      </div>

      <Card className="shadow-none">
        <CardBody className="p-4">
          <iframe 
            className="airtable-embed w-full" 
            src="https://airtable.com/embed/app67Fth4y8jbCRQu/pag4OJBnVQuFQZ46N/form" 
            frameBorder="0"
            width="100%" 
            height="1066" 
            style={{ background: "transparent", border: "1px solid #ccc" }}
            title="ASES Summit Organizer Form"
          ></iframe>
        </CardBody>
      </Card>
    </div>
  );
};


import React from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { NetworkApproval } from "./network-approval";

export const OrganizerView: React.FC = () => {
  const [selected, setSelected] = React.useState("network-approval");

  const handleTabChange = (key: string | number) => {
    setSelected(key.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Card className="shadow-none">
        <CardBody className="p-0">
          <Tabs
            aria-label="ASES Summit Organizer Tools"
            selectedKey={selected}
            onSelectionChange={handleTabChange}
            variant="underlined"
            color="primary"
            className="w-full"
          >
            <Tab key="network-approval" title="Network Approval">
              <div className="p-4">
                <NetworkApproval />
              </div>
            </Tab>
            <Tab key="stanford-students" title="Stanford Students">
              <div className="p-4">
                <iframe
                  className="airtable-embed w-full"
                  src="https://airtable.com/embed/app67Fth4y8jbCRQu/shrAlysUUBkf2Fq1z"
                  style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1000px" }}
                  title="Stanford Students"
                ></iframe>
              </div>
            </Tab>
            <Tab key="add-speaker" title="Add Speaker">
              <div className="p-4">
                <iframe
                  className="airtable-embed w-full"
                  src="https://airtable.com/embed/app67Fth4y8jbCRQu/pag4OJBnVQuFQZ46N/form"
                  style={{ background: "transparent", border: "1px solid #ccc", width: "100%", height: "1000px" }}
                  title="ASES Summit Organizer Form"
                ></iframe>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};


import React from "react";
import { Button } from "@heroui/react";
import { Hero } from "../components/hero";

// Commented out and replaced with a redirect to Google Drive directly
// To re-enable, uncomment this component and update the route in App.tsx
export const Footage: React.FC = () => {
  const driveUrl = "https://drive.google.com/drive/folders/1PluDG_TcnvSxsJtdBJauCgU2jqcrUccg?usp=sharing";

  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Footage</h1>
          <Button
            as="a"
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            size="lg"
          >
            Open in Google Drive
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://drive.google.com/embeddedfolderview?id=1PluDG_TcnvSxsJtdBJauCgU2jqcrUccg#list"
            style={{
              width: "100%",
              height: "700px",
              border: "0",
              borderRadius: "0.5rem"
            }}
            title="ASES Summit Footage"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 px-4 pt-4">Grid View</h2>
          <iframe
            src="https://drive.google.com/embeddedfolderview?id=1PluDG_TcnvSxsJtdBJauCgU2jqcrUccg#grid"
            style={{
              width: "100%",
              height: "500px",
              border: "0",
              borderRadius: "0.5rem"
            }}
            title="ASES Summit Footage Grid View"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

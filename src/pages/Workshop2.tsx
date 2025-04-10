import React from "react";
import { Button } from "@heroui/react";

export const Workshop2: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Workshop 2</h1>
        <Button
          as="a"
          href="https://drive.google.com/drive/folders/1dDwjuP8mA6fEUUVdat4NJ_zQysuJuJVG?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          size="lg"
        >
          Google Drive
        </Button>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 px-1">Canva Presentation</h2>
          <iframe
            src="https://www.canva.com/design/DAGkHmyjKB4/M8qGQuKseRdENxqInz9fgA/view?embed"
            allowFullScreen
            title="Workshop 2 Canva Presentation"
            className="w-full h-[500px] border-0 rounded-lg"
            style={{ borderRadius: '0.5rem' }}
          ></iframe>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 px-1">Google Slides Presentation</h2>
          <iframe
            src="https://docs.google.com/presentation/d/14a9ebiuZIrMQehBTN25GOSweDGrg1jnumU-Frui8OtM/embed?start=false&loop=false&delayms=3000"
            allowFullScreen
            title="Workshop 2 Google Slides Presentation"
            className="w-full h-[500px] border-0 rounded-lg"
            style={{ borderRadius: '0.5rem' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

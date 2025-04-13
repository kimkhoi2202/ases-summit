import React from "react";
import { Hero } from "../components/hero";
import { ContactForm } from "../components/contact-form";

export const SubmitNetwork: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Network Information</h1>
          <p className="text-gray-600">
            Fill out the form below to be featured on our Network page. Your submission will be reviewed by organizers.
          </p>
        </div>
        
        <ContactForm />
      </div>
    </>
  );
};

import React from "react";
import { Hero } from "../components/hero";

export const RyanChiang: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Ryan Chiang (EssaysThatWorked)</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Speaker Profile</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <p>Speaker information will be added here.</p>
                <p>This page is under construction.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import React from "react";
import { Icon } from "@iconify/react";

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background image with parallax effect */}
      <div 
        className="absolute inset-0 bg-fixed" 
        style={{
          backgroundImage: "url('https://ases.stanford.edu/summit_bg.png')",
          backgroundPosition: "top -70%", // ADJUST THIS VALUE to move image up/down
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)",
          backgroundSize: "50px 50px",
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO HEIGHT: Adjust padding values below to change hero section height */}
        <div className="pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">ASES Summit 2025</span>
              <span className="block mt-2" style={{ color: "#6abcff" }}>The Next Big Thing</span>
            </h1>
            
            <div className="mt-12 flex justify-center items-center space-x-6">
              <div className="flex items-center">
                <Icon icon="lucide:calendar" style={{ color: "#6abcff" }} className="text-xl mr-2" />
                <span className="text-white">April 6-12, 2025</span>
              </div>
              <div className="flex items-center">
                <Icon icon="lucide:map-pin" style={{ color: "#6abcff" }} className="text-xl mr-2" />
                <span className="text-white">Stanford University</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


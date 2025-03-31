import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e9edf6",
              100: "#d3dbed",
              200: "#a8b7db",
              300: "#7c94c8",
              400: "#5170b6",
              500: "#384b87", // ASES primary blue
              600: "#2e3e6c",
              700: "#232e51",
              800: "#171f36",
              900: "#0c101b",
              DEFAULT: "#384b87",
              foreground: "#ffffff"
            },
            secondary: {
              50: "#f6e9e9",
              100: "#edd3d2",
              200: "#dba8a6",
              300: "#c87c79",
              400: "#b6514d",
              500: "#8d3835", // ASES dark red
              600: "#712d2a",
              700: "#552220",
              800: "#381615",
              900: "#1c0b0b",
              DEFAULT: "#8d3835",
              foreground: "#ffffff"
            },
            success: {
              50: "#e7f8f3",
              100: "#d0f1e6",
              200: "#a1e3ce",
              300: "#71d5b5",
              400: "#42c79d",
              500: "#2da179",
              600: "#248161",
              700: "#1b6048",
              800: "#124030",
              900: "#092018",
              DEFAULT: "#2da179",
              foreground: "#ffffff"
            }
          }
        }
      }
    })
  ]
}

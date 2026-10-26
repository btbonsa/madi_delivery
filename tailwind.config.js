/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./legacy/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        anaheim: ["Anaheim_400Regular"],
        "anaheim-medium": ["Anaheim_500Medium"],
        "anaheim-semibold": ["Anaheim_600SemiBold"],
        "anaheim-bold": ["Anaheim_700Bold"],
        "anaheim-extrabold": ["Anaheim_800ExtraBold"],
      },
    },
  },
  plugins: [],
};

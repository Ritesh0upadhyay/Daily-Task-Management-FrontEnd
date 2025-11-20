/*- Helps VS Code understand the file type for autocomplete */
/** @type {import('tailwindcss').Config} */
// - Export the configuration object
export default {
  //  Tell Tailwind which files to scan for CSS classes
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], //Scan all JavaScript files in src folder
  theme: {
    //Where we can add custom colors, fonts, etc.
    extend: {},
  },
  plugins: [], //Additional Tailwind plugins (none needed now)
};

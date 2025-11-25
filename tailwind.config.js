/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
    content: [
        "./index.html",
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./public/**/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#1A4D74",
                    50: "#EAF4FA",
                    100: "#D6EBF6",
                    200: "#B3D9EE",
                    300: "#8FC7E6",
                    400: "#4DA6D9",
                    500: "#1A4D74"
                },
                accent: {
                    DEFAULT: "#F5CB53",
                    50: "#FFF6E5",
                    100: "#FFF0CC",
                    200: "#FFE39A",
                    300: "#FFD766",
                    400: "#FFC83A",
                    500: "#F5CB53"
                },
                neutral: {
                    50: "#FAFAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#D1D5DB",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#0F1724"
                }
            },
            fontFamily: {
                heading: ["Roboto", "sans-serif"],
                sans: ["Nunito", "sans-serif"]
            },
            borderRadius: {
                lg: "0.75rem"
            },
            boxShadow: {
                card: "0 8px 24px rgba(26,77,116,0.08)"
            }
        }
    },
    plugins: [
        typography,
        forms
    ]
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                shell: "#070b14",
                line: "rgba(148, 163, 184, 0.14)"
            },
            boxShadow: {
                neon: "0 0 0 1px rgba(56,189,248,0.18), 0 0 32px rgba(56,189,248,0.18)"
            },
            backgroundImage: {
                "neon-grid":
                    "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)"
            },
            backgroundSize: {
                grid: "42px 42px"
            }
        }
    },
    plugins: []
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {
        xxs: { max: "390px" }, // for screens smaller than 390px
      },
      padding: {
        "under-nav": "70px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "warning-yellow": "#F19A3E",
        "error-red": "#A31621",
        "primary-dark-green": "#3B513E",
        "background-gray": "#F3F3F3",
        "success-green": "#5B9279",
      },

      fontFamily: {
        proto: ["outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

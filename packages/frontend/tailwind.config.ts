// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      screens: {
        xxs: { max: "400px" }, // for screens smaller than 400px
      },
      padding: {
        "under-nav": "70px",
      },

      colors: {
        "warning-yellow": "#F19A3E",
        "error-red": "#A31621",
        "primary-dark-green": "#3B513E",
        "background-gray": "#F3F3F3",
        "success-green": "#5B9279",
      },
    },
  },
  plugins: [],
};
export default config;

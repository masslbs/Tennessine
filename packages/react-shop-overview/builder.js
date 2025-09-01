import * as esbuild from "esbuild";
await esbuild.build({
  entryPoints: ["./src/mod.tsx"],
  bundle: true,
  format: "esm",
  external: ["react", "react-dom", "styled-components"],
  outfile: "dist/bundle.js",
  banner: {
    js: `
import * as requireReact from 'react';
import * as requireReactDom from 'react-dom';

function require(m) {
 if (m === 'react') return requireReact;
 if (m === 'react-dom') return requireReactDom;
 throw new Error(\`Unknown module \${m}\`);
}`,
  },
});

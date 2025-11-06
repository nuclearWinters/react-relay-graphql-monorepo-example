import esbuild from "esbuild";
import customPlugin from "./customPlugin.js";
import svgr from "esbuild-plugin-svgr";
import stylexPlugin from "@stylexjs/esbuild-plugin";

try {
  await esbuild.build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outdir: "public/dist",
    splitting: true,
    format: "esm",
    plugins: [
      stylexPlugin({
        dev: false,
        useCSSLayers: true,
        stylexImports: ["@stylexjs/stylex"],
        generatedCSSFileName: "public/dist/out.css",
      }),
      customPlugin({ dev: false }),
      svgr(),
    ],
    loader: {
      ".png": "file",
    },
  });
  console.log("✅ Build JS complete");
} catch (err) {
  console.log(err);
  console.error("💣 Error building JS");
}

import esbuild from "esbuild";
import customPlugin from "./customPlugin.js";
import svgr from "esbuild-plugin-svgr";

console.log("✅ Starting development server");
const ctx = await esbuild.context({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  outdir: "public/dist",
  splitting: true,
  format: "esm",
  loader: {
    ".png": "file",
  },
  plugins: [customPlugin({ dev: true }), svgr()],
  define: {
    "process.env.AUTH_API": '""',
    "process.env.FINTECH_API": '""',
  },
});

const { host, port } = await ctx.serve({
  servedir: "public",
  port: 8000,
  fallback: "public/index.html",
});
console.log(`Serving at http://${host}:${port}`);
await ctx.watch();

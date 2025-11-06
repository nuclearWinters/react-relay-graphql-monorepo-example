import { transformAsync } from "@babel/core";
import { readFile } from "fs/promises";

const customPlugin = (config) => ({
  name: "relay-stylex-plugin",
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, async (args) => {
      try {
        const rawSource = await readFile(args.path, {
          encoding: "utf-8",
        });
        const babelTranform = await transformAsync(rawSource, {
          plugins: [
            ["@babel/plugin-syntax-typescript", { isTSX: true }],
            ["babel-plugin-relay"],
            ["@babel/plugin-syntax-jsx"],
            ["@stylexjs/babel-plugin", { dev: config.dev }],
          ],
          code: true,
          filename: args.path,
        });
        return {
          contents: babelTranform?.code,
          loader: "tsx",
        };
      } catch (err) {
        return {
          errors: [{ text: err.message }],
        };
      }
    });
  },
});

export default customPlugin;

import * as esbuild from "npm:esbuild@^0.25.0";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";
import * as fs from "jsr:@std/fs";
import * as path from "jsr:@std/path";

await fs.emptyDir("./dist");

const toCopy = [
  "./src/manifest.json",
  "./src/popup.html",
  "./src/popup.css",
  "./src/icon.svg",
];

for (const srcPath of toCopy) {
  const dstPath = path.resolve("./dist/", path.relative("./src/", srcPath));
  await fs.ensureDir(path.dirname(dstPath));
  await fs.copy(srcPath, dstPath);
}

const entryPoints = [
  "./src/popup-ui.js",
  "./src/install-devtools.js",
];

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints,
  outdir: "./dist/",
  bundle: true,
  format: "esm",
});

esbuild.stop();

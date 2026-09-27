import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

export const workDir = Path.join(import.meta.dirname, "../..");
export const fromRoot = (...path) => Path.join(workDir, ...path);
export const distDir = fromRoot("dist");

export const readDir = (...path) =>
  FileSystem.readdir(fromRoot(...path), { recursive: true });
export const readFile = (...path) =>
  FileSystem.readFile(fromRoot(...path), { encoding: "utf-8" });
export const writeFile = (path, content) =>
  FileSystem.writeFile(Path.join(distDir, path), content, {
    encoding: "utf-8"
  });
export const copyFile = (fromPath, toPath) => {
  const destination = Path.join(distDir, toPath);
  
  FileSystem.mkdir(Path.dirname(destination), { recursive: true })
    .then(() => FileSystem.copyFile(fromRoot(fromPath), destination));
}

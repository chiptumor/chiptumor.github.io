import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

export const workDir = Path.join(import.meta.dirname, "../..");
export const root = (...path) => Path.join(workDir, ...path);
export const dist = (...path) => root("dist", ...path);

export const readDir = (...path) =>
  FileSystem.readdir(root(...path), { recursive: true });
export const copyDir = (fromPath, toPath) =>
  FileSystem.cp(root(fromPath), dist(toPath), { recursive: true });
export const readFile = (...path) =>
  FileSystem.readFile(root(...path), { encoding: "utf-8" });
export const writeFile = async (path, content) => {
  const destination = dist(path);

  FileSystem.mkdir(Path.dirname(destination), { recursive: true })
    .then(() => FileSystem.writeFile(destination, content, {
      encoding: "utf-8"
    }));
};
export const copyFile = async (fromPath, toPath) => {
  const destination = dist(toPath);
  
  FileSystem.mkdir(Path.dirname(destination), { recursive: true })
    .then(() => FileSystem.copyFile(root(fromPath), destination));
};

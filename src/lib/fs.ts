import fs from "fs";
import path from "path";

export function writeJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function ensureDir(pathStr: string) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr, { recursive: true });
  }
}

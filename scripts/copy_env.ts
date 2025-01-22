#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "..", ".env");
const templatePath = path.resolve(__dirname, "..", ".env.template");

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(templatePath, envPath);
}

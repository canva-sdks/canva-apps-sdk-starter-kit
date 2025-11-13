#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const envPath = path.resolve(__dirname, "..", ".env");
const templatePath = path.resolve(__dirname, "..", ".env.template");

if (!fs.existsSync(templatePath)) {
  console.warn(".env.template file does not exist, skipping copy of .env file");
} else if (!fs.existsSync(envPath)) {
  fs.copyFileSync(templatePath, envPath);
}

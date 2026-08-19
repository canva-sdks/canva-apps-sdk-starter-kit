#!/usr/bin/env node
/* eslint-disable no-console */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const rootDir = path.join(__dirname, "..");
const examplesDir = path.join(rootDir, "examples");

interface StartFlags {
  useHttps: boolean;
  overrideFrontendPort?: number;
  preview: boolean;
  tunnel: boolean;
}

function listExamples(): string[] {
  const categories = fs
    .readdirSync(examplesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory());

  return categories.flatMap((category) => {
    const categoryPath = path.join(examplesDir, category.name);

    if (fs.existsSync(path.join(categoryPath, "index.tsx"))) {
      return [category.name];
    }

    return fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          fs.existsSync(path.join(categoryPath, entry.name, "index.tsx")),
      )
      .map((entry) => `${category.name}/${entry.name}`);
  });
}

function exampleDir(example: string): string {
  return path.join(examplesDir, ...example.split("/"));
}

async function resolveExample(requested: string): Promise<string> {
  const examples = listExamples();

  if (examples.includes(requested)) {
    return requested;
  }

  const matches = examples.filter(
    (example) =>
      example.endsWith(`/${requested}`) ||
      example.split("/").pop() === requested,
  );

  const [firstMatch, ...restMatches] = matches;

  if (!firstMatch) {
    console.warn(`No example found matching '${requested}'.`);
    process.exit(1);
  }

  if (restMatches.length === 0) {
    return firstMatch;
  }

  console.log(`Multiple examples found matching '${requested}':`);

  const { selected } = await prompts(
    {
      type: "select",
      name: "selected",
      message: "Please select the example you want to run:",
      choices: matches.map((match) => ({ title: match, value: match })),
    },
    {
      onCancel: () => {
        console.log("Aborted by the user.");
        process.exit(0);
      },
    },
  );

  if (!selected) {
    console.log("No example selected. Exiting.");
    process.exit(1);
  }

  return selected as string;
}

async function promptForExample(): Promise<string> {
  const examples = listExamples();

  const { example } = await prompts(
    {
      type: "autocomplete",
      name: "example",
      message: "Which example would you like to run?",
      choices: examples.map((example) => ({
        title: example.replace(/_/g, " ").replace(/\//g, " > "),
        value: example,
      })),
      suggest: async (input, choices) =>
        choices.filter((choice) =>
          choice.title.toLowerCase().includes(input.toLowerCase()),
        ),
    },
    {
      onCancel: () => {
        console.log("Aborted by the user.");
        process.exit(0);
      },
    },
  );

  if (example == null) {
    console.log("Error: No such example exists.");
    process.exit(1);
  }

  return example as string;
}

function buildFlags(args: StartFlags): string[] {
  const flags: string[] = [];

  if (args.useHttps) {
    flags.push("--use-https");
  }
  if (args.overrideFrontendPort != null) {
    flags.push("--override-frontend-port", String(args.overrideFrontendPort));
  }
  if (args.preview) {
    flags.push("--preview");
  }
  if (args.tunnel) {
    flags.push("--tunnel");
  }

  return flags;
}

// Spawns `canva apps start` for the selected example
function runStart(flags: string[], dir: string): void {
  const args = ["@canva/cli", "apps", "start"];

  const configPath = path.join(dir, "canva-app.config.ts");
  if (fs.existsSync(configPath)) {
    args.push("--config", configPath);
  } else {
    args.push("--entry", path.join(dir, "index.tsx"));

    const backendEntry = path.join(dir, "backend", "server.ts");
    if (fs.existsSync(backendEntry)) {
      args.push("--backend-entry", backendEntry);
    }
  }

  args.push(...flags);

  const child = spawn("npx", args, {
    stdio: "inherit",
    env: { ...process.env, CANVA_ASSETS_DIR: "examples/assets" },
  });

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));

  child.on("exit", (code) => process.exit(code ?? 0));
}

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("tunnel", {
    description: "Expose the backend server via a public tunnel.",
    type: "boolean",
    default: false,
  })
  .option("use-https", {
    description: "Start local development server on HTTPS.",
    type: "boolean",
    default: false,
  })
  .option("override-frontend-port", {
    description:
      "Port to run the local development server on. Overrides the frontend port set in the .env file.",
    type: "number",
    alias: "p",
  })
  .option("preview", {
    description: "Open the app in Canva.",
    type: "boolean",
    default: false,
  })
  .command(
    "$0 [example]",
    "Starts a local development server for an example app, prompting to pick one if not specified",
    (y) =>
      y.positional("example", {
        describe: "The example app to run",
        type: "string",
      }),
    async (args) => {
      const example = args.example
        ? await resolveExample(args.example)
        : await promptForExample();

      runStart(buildFlags(args), exampleDir(example));
    },
  )
  .parse();

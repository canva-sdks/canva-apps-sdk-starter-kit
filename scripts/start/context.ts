import "dotenv/config";

import fs from "fs";
import path from "path";

type CliArgs = {
  example?: string;
  useHttps: boolean;
  ngrok: boolean;
  preview: boolean;
  overrideFrontendPort?: number;
};

type EnvVars = {
  frontendPort: number;
  backendPort: number;
  hmrEnabled: boolean;
  appId?: string;
  appOrigin?: string;
  backendHost?: string;
};

export class Context {
  private readonly envVars: EnvVars;

  constructor(
    private env: NodeJS.ProcessEnv = process.env,
    private readonly args: CliArgs,
  ) {
    this.envVars = this.parseAndValidateEnvironmentVariables();
  }

  static get srcDir() {
    const src = path.join(Context.rootDir, "src");

    if (!fs.existsSync(src)) {
      throw new Error(`Directory does not exist: ${src}`);
    }

    return src;
  }

  static get examplesDir() {
    const examples = path.join(Context.rootDir, "examples");

    if (!fs.existsSync(examples)) {
      throw new Error(`Directory does not exist: ${examples}`);
    }

    return examples;
  }

  static get readmeDir() {
    return path.join(Context.rootDir, "README.md");
  }

  get entryDir() {
    const { example } = this.args;

    if (!example) {
      return Context.srcDir;
    }

    // Handle nested examples with parent/child format
    if (example.includes("/")) {
      const [parent, child] = example.split("/");
      if (!parent || !child) {
        throw new Error(`Invalid example format: ${example}`);
      }

      return path.join(Context.examplesDir, parent, child);
    }

    return path.join(Context.examplesDir, example);
  }

  get ngrokEnabled() {
    return this.args.ngrok;
  }

  get hmrEnabled() {
    return this.envVars.hmrEnabled;
  }

  get httpsEnabled() {
    return this.args.useHttps;
  }

  get frontendEntryPath() {
    const frontendEntryPath = path.join(this.entryDir, "index.tsx");

    if (!fs.existsSync(frontendEntryPath)) {
      throw new Error(
        `Entry point for frontend does not exist: ${frontendEntryPath}`,
      );
    }

    return frontendEntryPath;
  }

  get frontendUrl() {
    return `${this.protocol}://localhost:${this.frontendPort}`;
  }

  get frontendPort() {
    return this.args.overrideFrontendPort || this.envVars.frontendPort;
  }

  get developerBackendEntryPath(): string | undefined {
    const developerBackendEntryPath = path.join(
      this.entryDir,
      "backend",
      "server.ts",
    );

    if (!fs.existsSync(developerBackendEntryPath)) {
      return undefined;
    }

    return developerBackendEntryPath;
  }

  get backendUrl() {
    return `${this.protocol}://localhost:${this.envVars.backendPort}`;
  }

  get backendHost() {
    let backendHost = this.envVars.backendHost;

    // if there's no custom URL provided by the developer, we fallback to our localhost backend
    if (!backendHost || backendHost.trim() === "") {
      backendHost = this.backendUrl;
    }

    return backendHost;
  }

  get backendPort() {
    return this.envVars.backendPort;
  }

  get appOrigin(): string | undefined {
    return this.envVars.appOrigin;
  }

  get appId(): string | undefined {
    return this.envVars.appId;
  }

  get openPreview(): boolean {
    return this.args.preview;
  }

  static get examples(): string[] {
    return Object.keys(Context.categorizedExamples).flatMap((category) => {
      const examples = Context.categorizedExamples[category];

      if (!examples) {
        throw new Error(`No examples found for category: ${category}`);
      }

      return examples.map((example) => `${category}/${example}`);
    });
  }

  static get categorizedExamples(): Record<string, string[]> {
    try {
      const files = fs.readdirSync(this.examplesDir, { withFileTypes: true });
      const categories = files
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      const categorizedExamples: Record<string, string[]> = {};

      categories.forEach((category) => {
        const categoryPath = path.join(this.examplesDir, category);
        const examples = fs.readdirSync(categoryPath, { withFileTypes: true });

        // Check if this is a category with examples or a standalone example
        if (fs.existsSync(path.join(categoryPath, "index.tsx"))) {
          // This is a standalone example, add it to a special category
          if (!categorizedExamples["root"]) {
            categorizedExamples["root"] = [];
          }
          categorizedExamples["root"].push(category);
        }

        // Check for examples within this category
        const categoryExamples: string[] = [];
        examples.forEach((exampleDir) => {
          if (!exampleDir.isDirectory()) {
            return;
          }

          const exampleDirPath = path.join(categoryPath, exampleDir.name);
          if (fs.existsSync(path.join(exampleDirPath, "index.tsx"))) {
            categoryExamples.push(exampleDir.name);
          }
        });

        // Add examples to their category if any were found
        if (categoryExamples.length > 0) {
          categorizedExamples[category] = categoryExamples;
        }
      });

      return categorizedExamples;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error reading directory:", err);
      return {};
    }
  }

  private get protocol(): "https" | "http" {
    return this.httpsEnabled ? "https" : "http";
  }

  private static get rootDir() {
    return path.join(__dirname, "..", "..");
  }

  private parseAndValidateEnvironmentVariables(): EnvVars {
    const {
      CANVA_FRONTEND_PORT,
      CANVA_BACKEND_PORT,
      CANVA_BACKEND_HOST,
      CANVA_APP_ID,
      CANVA_APP_ORIGIN,
      CANVA_HMR_ENABLED,
    } = this.env;

    if (!CANVA_FRONTEND_PORT) {
      throw new Error(
        "CANVA_FRONTEND_PORT environment variable is not defined",
      );
    }

    if (!CANVA_BACKEND_PORT) {
      throw new Error("CANVA_BACKEND_PORT environment variable is not defined");
    }

    const envVars: EnvVars = {
      frontendPort: parseInt(CANVA_FRONTEND_PORT, 10),
      backendPort: parseInt(CANVA_BACKEND_PORT, 10),
      hmrEnabled: CANVA_HMR_ENABLED?.toLowerCase().trim() === "true",
      appId: CANVA_APP_ID,
      appOrigin: CANVA_APP_ORIGIN,
      backendHost: CANVA_BACKEND_HOST,
    };

    if (envVars.hmrEnabled && envVars.appOrigin == null) {
      throw new Error(
        "CANVA_HMR_ENABLED environment variable is TRUE, but CANVA_APP_ORIGIN is not set. Refer to the instructions in the README.md on configuring HMR.",
      );
    }

    return envVars;
  }
}

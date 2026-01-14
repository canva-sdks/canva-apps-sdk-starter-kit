import fs from "fs";
import path from "path";

interface CliArgs {
  example?: string;
  useHttps: boolean;
  ngrok: boolean;
  preview: boolean;
  overrideFrontendPort?: number;
}

interface EnvVars {
  frontendPort: number;
  backendPort: number;
  hmrEnabled: boolean;
  appId?: string;
  appOrigin?: string;
  backendHost?: string;
}

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

  static get readmeDir() {
    return path.join(Context.rootDir, "README.md");
  }

  get entryDir() {
    return Context.srcDir;
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
      Context.rootDir,
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

  private get protocol(): "https" | "http" {
    return this.httpsEnabled ? "https" : "http";
  }

  private static get rootDir() {
    return path.join(process.cwd());
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

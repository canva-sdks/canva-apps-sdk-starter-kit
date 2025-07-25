import AuthenticationService from "./auth_service";
import ApiClient from "./api_client";

interface ApiConfig {
  client_id: string;
  client_secret: string;
}

class ConfigurationService {
  private static instance: ConfigurationService;
  private isInitialized = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  /**
   * Initialize the API services with credentials from environment
   */
  private async initializeWithConfig(config: ApiConfig): Promise<void> {
    try {
      // Validate configuration
      if (!config.client_id || !config.client_secret) {
        throw new Error("client_id and client_secret are required");
      }

      // Configure authentication service
      const authService = AuthenticationService.getInstance();
      authService.configure({
        client_id: config.client_id,
        client_secret: config.client_secret,
      });

      // Test authentication by getting a token
      await authService.getAccessToken();

      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
      throw new Error(`Failed to initialize API services: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Initialize from environment variables
   */
  async initializeFromEnv(): Promise<void> {
    // Environment variables are injected by webpack's DefinePlugin
    const client_id = process.env.AGENCY_CLIENT_ID;
    const client_secret = process.env.AGENCY_CLIENT_SECRET;

    if (!client_id || !client_secret || client_id === "undefined" || client_secret === "undefined") {
      throw new Error(
        "Environment variables AGENCY_CLIENT_ID and AGENCY_CLIENT_SECRET must be set"
      );
    }

    await this.initializeWithConfig({
      client_id,
      client_secret,
    });
  }


  /**
   * Check if the services are initialized and ready
   */
  isReady(): boolean {
    return this.isInitialized && ApiClient.getInstance().isReady();
  }

  /**
   * Get the current configuration status
   */
  getStatus(): {
    initialized: boolean;
    apiReady: boolean;
    authStatus: {
      configured: boolean;
      hasValidToken: boolean;
      currentToken: string | null;
    };
  } {
    const apiClient = ApiClient.getInstance();
    return {
      initialized: this.isInitialized,
      apiReady: apiClient.isReady(),
      authStatus: apiClient.getAuthStatus(),
    };
  }

  /**
   * Reset the configuration (useful for testing or re-initialization)
   */
  reset(): void {
    this.isInitialized = false;
    AuthenticationService.getInstance().clearToken();
  }
}

export default ConfigurationService;
export type { ApiConfig };
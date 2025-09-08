interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
}

interface AuthCredentials {
  client_id: string;
  client_secret: string;
}

class AuthenticationService {
  private static instance: AuthenticationService;
  private baseUrl = "https://api.theagencymiddleware.io/v1";
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private credentials: AuthCredentials | null = null;
  private authPromise: Promise<string> | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * Configure the authentication credentials
   */
  configure(credentials: AuthCredentials): void {
    this.credentials = credentials;
    // Clear existing token when reconfiguring
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authPromise = null;
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    if (!this.credentials) {
      throw new Error("Authentication credentials not configured. Call configure() first.");
    }

    // If we have a valid token, return it
    if (this.accessToken && this.isTokenValid()) {
      return this.accessToken;
    }

    // If there's already an authentication request in progress, wait for it
    if (this.authPromise) {
      return this.authPromise;
    }

    // Start a new authentication request
    this.authPromise = this.authenticateWithAPI();
    
    try {
      const token = await this.authPromise;
      this.authPromise = null;
      return token;
    } catch (error) {
      this.authPromise = null;
      throw error;
    }
  }

  /**
   * Check if the current token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    
    // Add 5 minute buffer before expiry
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() < (this.tokenExpiry - bufferTime);
  }

  /**
   * Authenticate with the API and get a new token
   */
  private async authenticateWithAPI(): Promise<string> {
    if (!this.credentials) {
      throw new Error("Authentication credentials not configured");
    }

    try {
      console.log("doing auth",this.baseUrl,this.credentials)
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.credentials.client_id,
          client_secret: this.credentials.client_secret,
        }),
      });
      //console.log(response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} ${errorText}`);
      }

      const tokenData: TokenResponse = await response.json();
      console.log(tokenData);
      
      if (!tokenData.access_token) {
        throw new Error("No access token received from authentication endpoint");
      }

      // Store the token and calculate expiry
      this.accessToken = tokenData.access_token;
      
      if (tokenData.expires_in) {
        this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
      } else {
        // Default to 1 hour if no expiry provided
        this.tokenExpiry = Date.now() + (60 * 60 * 1000);
      }
      console.log("Returning access_token",this.accessToken)
      return this.accessToken;
    } catch (error) {
      this.accessToken = null;
      this.tokenExpiry = null;
      console.log(error);
      if (error instanceof Error) {
        throw new Error(`Middleware App Auth error: ${error.message}`);
      } else {
        throw new Error("Unknown authentication error occurred");
      }
    }
  }

  /**
   * Clear the stored token (useful for logout or testing)
   */
  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authPromise = null;
  }

  /**
   * Check if the service is configured
   */
  isConfigured(): boolean {
    return this.credentials != null;
  }

  /**
   * Get the current token without refreshing (for debugging)
   */
  getCurrentToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if we currently have a valid token
   */
  hasValidToken(): boolean {
    return this.accessToken != null && this.isTokenValid();
  }
}

export default AuthenticationService;
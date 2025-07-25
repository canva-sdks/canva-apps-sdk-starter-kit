import AuthenticationService from "./auth_service";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

interface SearchApiResponse {
  results?: Record<string, unknown>[];
  total?: number;
  page?: number;
  limit?: number;
}

interface AgentListResponse {
  agents?: Record<string, unknown>[];
  total?: number;
  page?: number;
  limit?: number;
}

interface AgentProfileResponse {
  agent?: Record<string, unknown>;
  profile?: Record<string, unknown>;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl = "https://api.theagencymiddleware.io/v1";
  private authService: AuthenticationService;

  private constructor() {
    this.authService = AuthenticationService.getInstance();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Make an authenticated request to the API
   */
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Get a valid access token
      const accessToken = await this.authService.getAccessToken();

      // Prepare headers with authentication
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      headers.set("Content-Type", "application/json");

      // Make the request
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const status = response.status;

      // Handle authentication errors
      if (status === 401) {
        // Clear the token and try once more
        this.authService.clearToken();
        
        try {
          const newAccessToken = await this.authService.getAccessToken();
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
          });

          if (!retryResponse.ok) {
            return {
              success: false,
              error: `API request failed: ${retryResponse.status} ${retryResponse.statusText}`,
              status: retryResponse.status,
            };
          }

          const retryData = await retryResponse.json();
          return {
            success: true,
            data: retryData,
            status: retryResponse.status,
          };
        } catch (retryError) {
          return {
            success: false,
            error: `Authentication retry failed: ${retryError instanceof Error ? retryError.message : "Unknown error"}`,
            status: 401,
          };
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API request failed: ${status} ${errorText}`,
          status,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        status,
      };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        status: 0,
      };
    }
  }

  /**
   * Search for agents using GET with query parameters
   */
  async searchAgents(query: string): Promise<ApiResponse<AgentListResponse>> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeAuthenticatedRequest<AgentListResponse>(`/agent/list?search=${encodedQuery}`, {
      method: "GET",
    });
  }

  /**
   * Get agent profile by email
   */
  async getAgentProfile(email: string): Promise<ApiResponse<AgentProfileResponse>> {
    const encodedEmail = encodeURIComponent(email);
    return this.makeAuthenticatedRequest<AgentProfileResponse>(`/agent/public-profile?email=${encodedEmail}`, {
      method: "GET",
    });
  }

  /**
   * Search for listings
   */
  async searchListings(query: string): Promise<ApiResponse<SearchApiResponse>> {
    return this.makeAuthenticatedRequest<SearchApiResponse>("/listings", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  /**
   * Search for market data
   */
  async searchMarketData(query: string): Promise<ApiResponse<SearchApiResponse>> {
    return this.makeAuthenticatedRequest<SearchApiResponse>("/market-data", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  /**
   * Generic search method for any endpoint
   */
  async search(endpoint: string, query: string): Promise<ApiResponse<SearchApiResponse>> {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    
    return this.makeAuthenticatedRequest<SearchApiResponse>(normalizedEndpoint, {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  /**
   * Get detailed data for a specific item by ID
   */
  async getDetails(endpoint: string, itemId: string): Promise<ApiResponse> {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    
    return this.makeAuthenticatedRequest(`${normalizedEndpoint}/${itemId}`, {
      method: "GET",
    });
  }

  /**
   * Make a custom authenticated request
   */
  async customRequest<T>(
    endpoint: string,
    method = "GET",
    body?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return this.makeAuthenticatedRequest<T>(endpoint, options);
  }

  /**
   * Check if the API client is ready (authenticated)
   */
  isReady(): boolean {
    return this.authService.isConfigured();
  }

  /**
   * Get authentication status
   */
  getAuthStatus(): {
    configured: boolean;
    hasValidToken: boolean;
    currentToken: string | null;
  } {
    return {
      configured: this.authService.isConfigured(),
      hasValidToken: this.authService.hasValidToken(),
      currentToken: this.authService.getCurrentToken(),
    };
  }
}

export default ApiClient;
export type { ApiResponse, SearchApiResponse, AgentListResponse, AgentProfileResponse };
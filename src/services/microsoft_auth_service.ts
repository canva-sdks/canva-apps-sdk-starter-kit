import { auth } from "@canva/user";

interface UserProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
}

interface MicrosoftAuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  error: string | null;
  loading: boolean;
}

class MicrosoftAuthService {
  private static instance: MicrosoftAuthService;
  private oauth: ReturnType<typeof auth.initOauth>;
  private scope = new Set(["openid", "profile", "email", "User.Read"]);
  private state: MicrosoftAuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null,
    loading: true,
  };
  private listeners: ((state: MicrosoftAuthState) => void)[] = [];

  private constructor() {
    this.oauth = auth.initOauth();
    this.initialize();
  }

  static getInstance(): MicrosoftAuthService {
    if (!MicrosoftAuthService.instance) {
      MicrosoftAuthService.instance = new MicrosoftAuthService();
    }
    return MicrosoftAuthService.instance;
  }

  /**
   * Subscribe to authentication state changes
   */
  subscribe(listener: (state: MicrosoftAuthState) => void): () => void {
    this.listeners.push(listener);
    // Call immediately with current state
    listener(this.state);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<MicrosoftAuthState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Initialize authentication state
   */
  private async initialize(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });
      await this.checkExistingAuth();
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    }
  }

  /**
   * Check if user is already authenticated
   */
  private async checkExistingAuth(): Promise<void> {
    try {
      const tokenResponse = await this.oauth.getAccessToken({ 
        scope: this.scope,
        forceRefresh: false 
      });

      if (tokenResponse && tokenResponse.token) {
        await this.fetchUserProfile(tokenResponse.token);
        this.setState({
          loading: false,
          error: null,
          isAuthenticated: true,
          accessToken: tokenResponse.token,
        });
      } else {
        this.setState({
          loading: false,
          error: null,
          isAuthenticated: false,
          user: null,
          accessToken: null,
        });
      }
    } catch {
      this.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    }
  }

  /**
   * Fetch user profile from Microsoft Graph API
   */
  private async fetchUserProfile(accessToken: string): Promise<void> {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const userProfile: UserProfile = await response.json();
      this.setState({ user: userProfile });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : "Failed to fetch user profile",
        user: null,
      });
    }
  }

  /**
   * Initiate Microsoft OAuth login
   */
  async login(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });

      // Request authorization from Microsoft
      await this.oauth.requestAuthorization({ scope: this.scope });

      // Get the access token
      const tokenResponse = await this.oauth.getAccessToken({ 
        scope: this.scope,
        forceRefresh: true 
      });

      if (!tokenResponse || !tokenResponse.token) {
        throw new Error("Failed to obtain access token");
      }

      // Fetch user profile
      await this.fetchUserProfile(tokenResponse.token);

      this.setState({
        loading: false,
        error: null,
        isAuthenticated: true,
        accessToken: tokenResponse.token,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Login failed",
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });
      
      await this.oauth.deauthorize();
      
      this.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      });
      throw error;
    }
  }

  /**
   * Get current authentication state
   */
  getState(): MicrosoftAuthState {
    return { ...this.state };
  }

  /**
   * Get current access token (refreshes if needed)
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const tokenResponse = await this.oauth.getAccessToken({ 
        scope: this.scope,
        forceRefresh: false 
      });
      
      if (tokenResponse && tokenResponse.token) {
        this.setState({ accessToken: tokenResponse.token });
        return tokenResponse.token;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserProfile | null {
    return this.state.user;
  }
}

export default MicrosoftAuthService;
export type { UserProfile, MicrosoftAuthState };
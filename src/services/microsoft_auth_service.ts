import { auth } from "@canva/user";
import type { AccessTokenResponse } from "@canva/user";

const oauth = auth.initOauth();
const scope = new Set(["openid"]);

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
  private state: MicrosoftAuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null,
    loading: true,
  };
  private listeners: ((state: MicrosoftAuthState) => void)[] = [];

  private constructor() {
    this.initialize();
  }

  static getInstance(): MicrosoftAuthService {
    if (!MicrosoftAuthService.instance) {
      MicrosoftAuthService.instance = new MicrosoftAuthService();
    }
    return MicrosoftAuthService.instance;
  }

  subscribe(listener: (state: MicrosoftAuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private setState(updates: Partial<MicrosoftAuthState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

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

  private async checkExistingAuth(): Promise<void> {
    try {
      const tokenResponse = await oauth.getAccessToken({ 
        scope,
        forceRefresh: false 
      });

      if (tokenResponse && tokenResponse.token) {
        const basicUser: UserProfile = {
          id: "microsoft-user",
          displayName: "Microsoft User",
          mail: "",
          userPrincipalName: "user@microsoft.com"
        };
        
        this.setState({
          loading: false,
          error: null,
          isAuthenticated: true,
          accessToken: tokenResponse.token,
          user: basicUser
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
    } catch (error) {
      this.setState({
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    }
  }

  async login(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });
      
      const authorizeResponse = await oauth.requestAuthorization({ scope });
      
      if (authorizeResponse.status === "completed") {
        await this.retrieveAndSetToken({ forceRefresh: true });
      }
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

  private async retrieveAndSetToken({ forceRefresh = false } = {}): Promise<void> {
    try {
      const accessTokenResponse = await oauth.getAccessToken({ scope, forceRefresh });
      
      if (accessTokenResponse && accessTokenResponse.token) {
        const basicUser: UserProfile = {
          id: "microsoft-user",
          displayName: "Microsoft User",
          mail: "",
          userPrincipalName: "user@microsoft.com"
        };
        
        this.setState({
          loading: false,
          error: null,
          isAuthenticated: true,
          accessToken: accessTokenResponse.token,
          user: basicUser,
        });
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });
      
      await oauth.deauthorize();
      
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

  getState(): MicrosoftAuthState {
    return { ...this.state };
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const tokenResponse = await oauth.getAccessToken({ 
        scope,
        forceRefresh: false 
      });
      
      if (tokenResponse && tokenResponse.token) {
        this.setState({ accessToken: tokenResponse.token });
        return tokenResponse.token;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  getCurrentUser(): UserProfile | null {
    return this.state.user;
  }
}

export default MicrosoftAuthService;
export type { UserProfile, MicrosoftAuthState };
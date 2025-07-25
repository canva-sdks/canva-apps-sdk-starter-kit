# Microsoft Azure Active Directory OAuth Setup

This application now requires Microsoft Azure Active Directory authentication for access. Users must sign in with their Microsoft accounts before they can use the agency data tools.

## Prerequisites

Before users can authenticate, you need to configure OAuth settings in both Microsoft Azure and the Canva Developer Portal.

### 1. Azure Active Directory Setup

1. **Register your application in Azure AD:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Fill in the application details:
     - Name: Your app name (e.g., "Agency Canva App")
     - Supported account types: Choose appropriate option
     - Redirect URI: Leave blank for now (Canva will handle this)

2. **Configure API permissions:**
   - In your registered app, go to "API permissions"
   - Add the following Microsoft Graph permissions:
     - `openid` (Sign users in)
     - `profile` (View users' basic profile)
     - `email` (View users' email address)
     - `User.Read` (Sign in and read user profile)

3. **Note your Application (client) ID:**
   - Copy the "Application (client) ID" from the Overview page
   - This will be used in Canva Developer Portal configuration

### 2. Canva Developer Portal Setup

1. **Go to your app in the Canva Developer Portal**

2. **Configure OAuth settings:**
   - Navigate to the "Authentication" section
   - Enable OAuth 2.0
   - Set the following:
     - **Authorization endpoint:** `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
     - **Token endpoint:** `https://login.microsoftonline.com/common/oauth2/v2.0/token`
     - **Client ID:** Your Azure Application (client) ID
     - **Client Secret:** Create a client secret in Azure AD and paste it here
     - **Scopes:** `openid profile email User.Read`

3. **Set redirect URIs in Azure:**
   - Copy the redirect URI provided by Canva Developer Portal
   - Go back to Azure AD App registration
   - Add this redirect URI under "Authentication" > "Redirect URIs"

### 3. Security Considerations

- **Client Secret:** Keep your Azure client secret secure and rotate it regularly
- **Scopes:** Only request the minimum required permissions
- **Tenant Configuration:** Consider restricting to your organization's tenant if appropriate
- **Conditional Access:** Azure AD conditional access policies will still apply

## How It Works

1. **User Access:** When users open the Canva app, they see a login screen
2. **Authentication:** Users click "Sign in with Microsoft" to start OAuth flow
3. **Authorization:** Users consent to share their basic profile information
4. **App Access:** Once authenticated, users can access all app features
5. **Session Management:** Authentication state is managed by Canva's OAuth system

## User Experience

- **First Visit:** Users see a clean login screen explaining the requirement
- **Authentication:** Standard Microsoft login flow (supports MFA, conditional access)
- **Logged In State:** App header shows user name and email with logout option
- **Persistent Login:** Users stay logged in across Canva sessions
- **Logout:** Users can explicitly logout from the app header

## Troubleshooting

### Common Issues:

1. **"Authentication Error"**
   - Check Azure client ID and secret in Canva Developer Portal
   - Verify redirect URIs match between Azure and Canva
   - Ensure required API permissions are granted

2. **"Access Denied"**
   - User may have denied consent
   - Check if user's organization allows external app access
   - Verify Azure AD conditional access policies

3. **"Invalid Scope"**
   - Ensure scopes in Canva match those configured in Azure
   - Check that permissions are granted and admin consent given if required

### Testing:

- Test with different user accounts (admin, regular user, guest)
- Test with users from different tenants if supporting multi-tenant
- Verify logout functionality works correctly
- Test token refresh behavior for long sessions

## API Integration

The Microsoft authentication integrates seamlessly with your existing Agency Middleware API authentication. Users must be authenticated with Microsoft before they can access the agency data endpoints.

The authentication flow ensures that only authorized users can:
- Search agents, listings, and market data
- View detailed profile information
- Add content to their Canva designs

This provides an additional layer of security for your agency data while maintaining a smooth user experience.
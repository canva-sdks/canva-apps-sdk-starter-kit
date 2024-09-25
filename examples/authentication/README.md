# README

If your app requires access to resources on a third-party platform (e.g. Google Drive), you can use OAuth to simplify the authorization process for your users. This method allows users to securely grant your app the necessary permissions with a third party service without exposing user credentials.

Canva enhances this process by handling the OAuth flow and the management of access and refresh tokens. This means that Canva does the heavy lifting in ensuring that your app maintains continuous and security-hardened access to the third-party resources it needs, streamlining the user experience and reducing the development burden on your team. Canva currently supports the authorization code flow, with and without Proof-of Key Code Exchange (PKCE).

The authentication API makes it easier to adopt the industry-standard OAuth 2, because Canva's servers are responsible for interacting with your chosen Identity Provider (IdP).

## Getting started

Before using this example, you'll need to [configure you provider details](https://www.canva.dev/docs/apps/authenticating-users/oauth/#prerequisite-configure-developer-portal) in the developer portal.

Once this is done, simply run the example from the root of `canva-api-starter-kit` with:

```sh
npm start authentication
```

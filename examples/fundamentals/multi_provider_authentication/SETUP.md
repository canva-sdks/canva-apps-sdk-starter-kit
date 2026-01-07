# Setup

## Getting started

Before using this example, you'll need to configure multiple OAuth providers in the [Developer Portal](https://www.canva.com/developers/apps):

1. **Configure Meta OAuth provider**: Follow the [OAuth integration guide](https://www.canva.dev/docs/apps/authenticating-users/oauth#prerequisite-configure-developer-portal) to set up a Meta provider with provider name `meta`.

2. **Configure Google OAuth provider**: Follow the same guide to set up a Google provider with provider name `google`.

Each provider needs to be configured separately in the Developer Portal with its own:

- Authorization endpoint
- Token endpoint
- Client ID and Client Secret

Once both providers are configured, simply run the example from the root of `canva-apps-sdk-starter-kit` with:

```sh
npm start multi_provider_authentication
```

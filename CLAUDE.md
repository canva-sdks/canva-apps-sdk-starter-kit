# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start development server (default boilerplate app)
npm start

# Start a specific example app
npm start <example-name>

# List all available examples
npm start examples

# Start with HTTPS enabled (required for Safari)
npm start --use-https
npm start <example-name> --use-https
```

### Build & Deploy
```bash
# Production build
npm run build

# Extract i18n messages
npm run extract
```

### Code Quality
```bash
# Type checking
npm run lint:types

# Linting
npm run lint        # Run ESLint
npm run lint:strict # Fail on warnings
npm run lint:fix    # Auto-fix issues

# Formatting
npm run format       # Format all code
npm run format:check # Check formatting
```

### Testing
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Run a single test file
npm test path/to/test.tsx
```

## High-Level Architecture

### Core Structure
This is a Canva Apps SDK starter kit for building apps that integrate with Canva's editor. Apps run as iframe embeds within Canva and communicate via the SDK APIs.

### Key Components

1. **Main App Entry Point**: `src/app.tsx` - The boilerplate app demonstrating basic SDK usage
2. **Examples Directory**: `examples/` - Contains 40+ example apps demonstrating different SDK capabilities
3. **Webpack Configuration**: Apps are bundled using Webpack with TypeScript and React
4. **Backend Support**: Some examples include Express.js backends in `backend/server.ts` files

### SDK Architecture

The app uses several Canva SDK packages:
- `@canva/app-ui-kit`: UI components that match Canva's design system
- `@canva/design`: APIs for interacting with the design (adding elements, pages, etc.)
- `@canva/asset`: Asset management APIs
- `@canva/platform`: Platform utilities (external URLs, authentication)
- `@canva/user`: User information APIs
- `@canva/intents`: Data connector intents for external data integration

### Development Workflow

1. Apps are served locally via webpack-dev-server (default port 8080)
2. The Development URL is configured in Canva's Developer Portal
3. Apps are previewed directly within the Canva editor
4. Hot Module Replacement (HMR) can be enabled for faster development

### Backend Integration

For apps with backends:
- Backend runs on port 3001 by default
- JWT verification is used for secure communication
- App ID must be set in `.env` for backend examples
- The `CANVA_BACKEND_HOST` environment variable configures the backend URL

### Environment Configuration

Key environment variables in `.env`:
- `CANVA_APP_ID`: Your app's ID for JWT verification
- `CANVA_APP_ORIGIN`: App origin for enabling HMR
- `CANVA_BACKEND_HOST`: Backend server URL
- `CANVA_HMR_ENABLED`: Enable/disable Hot Module Replacement

### Testing Strategy

- Jest with TypeScript support for unit tests
- React Testing Library for component testing
- Tests use `.tests.tsx` extension
- Snapshot testing is used in some examples (e.g., `i18n`, `ui_test`)

### Internationalization

- Uses `react-intl` for i18n support
- Messages are extracted during build
- The `@formatjs/ts-transformer` handles message extraction
- Example implementation in `examples/i18n/`

### Important Notes

1. **Node Version**: Requires Node.js v18 or v20.10.0 (use nvm with .nvmrc)
2. **Safari Development**: Requires HTTPS - use `npm start --use-https`
3. **Production Builds**: Update `CANVA_BACKEND_HOST` before building for production
4. **App Preview**: Apps can only be previewed through the Canva editor, not directly via localhost
# CLAUDE.md - Canva Apps SDK Starter Kit

> Comprehensive guide for AI assistants working with the Canva Apps SDK Starter Kit

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflows](#development-workflows)
4. [Key Conventions](#key-conventions)
5. [Environment Configuration](#environment-configuration)
6. [Testing & Quality](#testing--quality)
7. [Build & Deployment](#build--deployment)
8. [Common Tasks](#common-tasks)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is this?

This is the **Canva Apps SDK Starter Kit**, a TypeScript + React boilerplate for building Canva Apps that run inside the Canva editor as sandboxed iframes.

### Key Facts

- **Language**: TypeScript (strict mode, ES2019 target)
- **Framework**: React 19.2.0 with hooks
- **Build Tool**: Webpack 5 with custom configuration
- **UI Library**: `@canva/app-ui-kit` (required for Canva design compliance)
- **Internationalization**: react-intl with formatjs
- **Testing**: Jest with jsdom and React Testing Library
- **Node Version**: v18 or v20.10.0 (see `.nvmrc`)
- **Package Manager**: npm v9 or v10

### Official Documentation

- **Main Docs**: https://www.canva.dev/docs/apps/
- **MCP Server**: https://www.canva.dev/docs/apps/mcp-server/
- **Canva CLI**: https://www.canva.dev/docs/apps/canva-cli.md

---

## Codebase Structure

### Directory Layout

```
canva-apps-sdk-starter-kit/
├── src/                          # Main application source
│   ├── index.tsx                 # React entry point
│   └── app.tsx                   # Main app component
├── examples/                     # Demo apps organized by category
│   ├── app_elements/             # App element examples
│   ├── assets_and_media/         # Asset handling examples
│   ├── content_replacement/      # Content replacement examples
│   ├── design_elements/          # Design element examples
│   ├── design_interaction/       # Design manipulation examples
│   ├── drag_and_drop/            # Drag-and-drop examples
│   ├── fundamentals/             # Core concepts (auth, fetch, etc.)
│   ├── intents/                  # Intent-based examples
│   ├── localization/             # i18n examples
│   ├── testing/                  # Testing examples
│   └── ui/                       # UI component examples
├── utils/                        # Shared utilities
│   ├── backend/                  # Backend utilities (JWT, base server)
│   ├── use_add_element.ts        # Hook for adding elements
│   ├── use_feature_support.ts    # Feature detection hook
│   ├── use_overlay_hook.ts       # Overlay management hook
│   ├── use_selection_hook.ts     # Selection management hook
│   └── table_wrapper.ts          # Table element utilities
├── styles/                       # Global CSS modules
│   └── components.css            # Common component styles
├── scripts/                      # Build and development scripts
│   ├── start/                    # Start script logic
│   ├── ssl/                      # SSL certificate generation
│   └── copy_env.ts               # .env file setup
├── assets/                       # Static assets
├── declarations/                 # TypeScript declarations
├── dist/                         # Build output (gitignored)
├── .env                          # Environment variables (gitignored)
├── .env.template                 # Environment template
├── webpack.config.ts             # Webpack configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── jest.config.js                # Jest configuration
└── package.json                  # Dependencies and scripts
```

### Example Structure

Each example follows this pattern:

```
examples/<category>/<example_name>/
├── index.tsx                     # Entry point
├── app.tsx                       # Main component
├── package.json                  # Example metadata
├── README.md                     # Example documentation
└── backend/                      # Optional backend (if needed)
    └── server.ts                 # Express server with JWT middleware
```

### Key Files

| File | Purpose |
|------|---------|
| `src/app.tsx` | Main boilerplate app component |
| `webpack.config.ts` | Webpack config with dev server, HMR, and build settings |
| `utils/use_add_element.ts` | Hook demonstrating feature detection pattern |
| `utils/backend/jwt_middleware.ts` | JWT verification for backend routes |
| `.env` | App credentials (APP_ID, APP_ORIGIN, HMR settings) |
| `eslint.config.mjs` | ESLint with Canva app rules and i18n enforcement |

---

## Development Workflows

### Starting Development

```bash
# Start the boilerplate app
npm start

# Start a specific example
npm start <example_name>
# OR
npm start <category>/<example_name>

# List all examples interactively
npm start examples

# Start with HTTPS (required for Safari)
npm start --use-https
```

**Development server runs at**: `http://localhost:8080`

### Hot Module Replacement (HMR)

HMR significantly speeds up development by reflecting changes without full page reloads.

**Setup**:
1. Get `.env` credentials from [Developer Portal](https://www.canva.com/developers/apps) → Security → Credentials
2. Set in `.env`:
   ```bash
   CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com
   CANVA_HMR_ENABLED=true
   ```
3. Restart dev server
4. Reload app once in Canva

**Note**: HMR does NOT work in Docker containers.

### Previewing Apps

Apps cannot be previewed at `localhost:8080` directly. They MUST be previewed in the Canva editor:

1. Create app in [Developer Portal](https://www.canva.com/developers/apps)
2. Set **Development URL** to `http://localhost:8080`
3. Click **Preview** to open in Canva editor
4. Click **Open** (first-time only)

### Running Examples with Backends

Some examples have Express backends that auto-start with `npm start`.

**Backend runs at**: `http://localhost:3001`

**Setup**:
1. Copy `.env` from Developer Portal → Security → Credentials
2. Ensure `CANVA_APP_ID` is set (required for JWT verification)
3. For HTTPS: set `CANVA_BACKEND_HOST=https://localhost:3001`

**Example**:
```bash
# .env
CANVA_APP_ID=AABBccddeeff
CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com
CANVA_BACKEND_PORT=3001
CANVA_FRONTEND_PORT=8080
CANVA_BACKEND_HOST=http://localhost:3001
CANVA_HMR_ENABLED=TRUE

# Start example
npm start fetch
```

### Building for Production

```bash
npm run build
```

**Output**: `dist/app.js` (single bundled file)

**Important**:
- Updates `CANVA_BACKEND_HOST` to production URL before building
- Single JS file constraint (enforced by `LimitChunkCountPlugin`)
- Includes i18n message extraction to `dist/messages_en.json`
- Submit `dist/app.js` via [Developer Portal](https://www.canva.com/developers/apps)

---

## Key Conventions

### TypeScript

- **Strict mode enabled** (`strict: true`)
- **Target**: ES2019
- **Module**: ESNext (Webpack handles bundling)
- **No implicit any**: Disabled (`noImplicitAny: false`)
- **Path aliases**:
  ```ts
  import styles from "styles/components.css";
  import { myUtil } from "utils/my_util";
  import logo from "assets/logo.png";
  ```

### React Patterns

#### Feature Support Hook Pattern

Always check feature support before using Canva APIs:

```ts
import { features } from "@canva/platform";
import { addElementAtPoint, addElementAtCursor } from "@canva/design";

// Check if feature is supported
if (features.isSupported(addElementAtPoint)) {
  addElementAtPoint({ type: "text", children: ["Hello"] });
} else if (features.isSupported(addElementAtCursor)) {
  addElementAtCursor({ type: "text", children: ["Hello"] });
}
```

See `utils/use_feature_support.ts` and `utils/use_add_element.ts` for reusable patterns.

#### Component Structure

```tsx
import { Button, Rows, Text } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

export const MyComponent = () => {
  // Hooks
  const addElement = useAddElement();

  // Handlers
  const onClick = () => {
    addElement({ type: "text", children: ["Hello"] });
  };

  // Render
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>Content</Text>
        <Button onClick={onClick} variant="primary">
          Action
        </Button>
      </Rows>
    </div>
  );
};
```

### CSS Modules

- **File naming**: `*.css` (not `*.module.css`)
- **Import pattern**: `import * as styles from "styles/components.css"`
- **Usage**: `className={styles.scrollContainer}`
- **Processing**: PostCSS with cssnano optimization
- **Scope**: Automatically scoped (CSS Modules enabled in webpack)

### Internationalization (i18n)

Using react-intl with formatjs transformer:

```tsx
import { FormattedMessage, useIntl } from "react-intl";

// In JSX
<FormattedMessage
  defaultMessage="Welcome to {appName}!"
  description="Greeting message on home screen"
  values={{ appName: "Canva" }}
/>

// In code
const intl = useIntl();
const label = intl.formatMessage({
  defaultMessage: "Click here",
  description: "Button label for action"
});
```

**Important**:
- `defaultMessage` is required
- `description` is required (explains context for translators)
- Build extracts messages to `dist/messages_en.json`
- ESLint enforces i18n in `src/` and `examples/localization/`

### Backend Patterns

#### JWT Middleware

All backend routes must verify Canva JWT tokens:

```ts
import * as express from "express";
import { createJwtMiddleware } from "utils/backend/jwt_middleware";

const APP_ID = process.env.CANVA_APP_ID;
const router = express.Router();

// Initialize JWT middleware (BEFORE routes)
const jwtMiddleware = createJwtMiddleware(APP_ID);
router.use(jwtMiddleware);

// Routes have access to req.canva
router.get("/my-route", async (req, res) => {
  const { appId, userId, brandId } = req.canva;
  // ... route logic
});
```

#### CORS Configuration

Configure CORS for your app origin:

```ts
import * as cors from "cors";

const corsOptions = {
  origin: `https://app-${APP_ID.toLowerCase()}.canva-apps.com`,
  optionsSuccessStatus: 200
};
router.use(cors(corsOptions));
```

#### Backend Constants

Use `BACKEND_HOST` global (injected by webpack):

```ts
// Frontend code
const response = await fetch(`${BACKEND_HOST}/custom-route`);
```

`BACKEND_HOST` is set via `CANVA_BACKEND_HOST` in `.env`.

---

## Environment Configuration

### .env File Structure

```bash
# Frontend port (default: 8080)
CANVA_FRONTEND_PORT=8080

# Backend port (default: 3001)
CANVA_BACKEND_PORT=3001

# Backend host (change for production!)
CANVA_BACKEND_HOST=http://localhost:3001

# App ID (from Developer Portal)
CANVA_APP_ID=AABBccddeeff

# App origin for HMR (from Developer Portal)
CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com

# Enable Hot Module Replacement
CANVA_HMR_ENABLED=TRUE
```

### Getting Credentials

1. Go to [Developer Portal](https://www.canva.com/developers/apps)
2. Select your app
3. Navigate to **Security → Credentials → .env file**
4. Copy contents to `.env`

### Production Checklist

- [ ] Update `CANVA_BACKEND_HOST` to production URL
- [ ] Verify CORS origin matches production app origin
- [ ] Remove or disable HMR (`CANVA_HMR_ENABLED=FALSE`)
- [ ] Test build output (`npm run build`)
- [ ] Verify environment variables are not hardcoded

---

## Testing & Quality

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test:watch
```

**Test location**: Files matching `**/*.tests.tsx?` pattern

**Example**:
```tsx
import { render, screen } from "@testing-library/react";
import { App } from "./app";

describe("App", () => {
  it("renders welcome message", () => {
    render(<App />);
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
});
```

### Linting

```bash
# Check for errors
npm run lint

# Auto-fix
npm run lint:fix

# Strict mode (no warnings)
npm run lint:strict
```

**ESLint config**: Uses `@canva/app-eslint-plugin`
- Enforces i18n in `src/` and `examples/localization/`
- Catches common Canva app mistakes

### Type Checking

```bash
npm run lint:types
```

Runs TypeScript compiler without emitting files.

### Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific file
npm run format:file path/to/file.tsx
```

**Prettier config** (`.prettierrc`):
- 80 character line width
- 2 space indentation
- Double quotes
- Trailing commas
- Semicolons

---

## Build & Deployment

### Build Process

```bash
npm run build
```

**Steps**:
1. Webpack bundles to `dist/app.js` (single file)
2. TypeScript transpiled to ES2019
3. CSS modules processed and minified
4. i18n messages extracted to `dist/messages_en.json`
5. Source maps generated

**Output**:
- `dist/app.js` - Single bundled JavaScript file
- `dist/messages_en.json` - Extracted i18n messages

### Webpack Configuration

Key settings in `webpack.config.ts`:

| Setting | Value | Purpose |
|---------|-------|---------|
| Entry | `src/index.tsx` | React app entry |
| Output | `dist/app.js` | Single file (required by Canva) |
| Mode | `production` / `development` | Optimization level |
| Aliases | `assets`, `utils`, `styles`, `src` | Path resolution |
| Loaders | ts-loader, css-loader, style-loader | TypeScript + CSS Modules |
| Plugins | DefinePlugin, LimitChunkCountPlugin | Env vars, single chunk |

### Deployment

1. Build: `npm run build`
2. Test output: Verify `dist/app.js` exists
3. Upload: Go to [Developer Portal](https://www.canva.com/developers/apps)
4. Submit: Upload `dist/app.js` for review

**Pre-submission checklist**:
- [ ] `CANVA_BACKEND_HOST` points to production
- [ ] CORS configured for production origin
- [ ] All tests passing (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run lint:types`)
- [ ] App tested in Canva preview mode

---

## Common Tasks

### Adding a New Feature

1. **Edit** `src/app.tsx` or create new components
2. **Import** Canva SDK packages as needed:
   ```tsx
   import { Button } from "@canva/app-ui-kit";
   import { addElementAtPoint } from "@canva/design";
   import { requestOpenExternalUrl } from "@canva/platform";
   ```
3. **Check feature support** using `features.isSupported()`
4. **Test** in Canva editor (close and reopen app)
5. **Add tests** if complex logic added

### Adding a Backend Route

1. **Create** or edit `backend/server.ts`:
   ```ts
   router.get("/my-route", async (req, res) => {
     const { userId } = req.canva; // JWT verified
     // ... logic
     res.json({ success: true });
   });
   ```
2. **Update** CORS if needed
3. **Set** `CANVA_APP_ID` in `.env`
4. **Call** from frontend:
   ```ts
   const res = await fetch(`${BACKEND_HOST}/my-route`);
   ```

### Exploring Examples

```bash
# Interactive example selector
npm start examples

# Run specific example
npm start drag_and_drop_image

# Read example README
cat examples/drag_and_drop/drag_and_drop_image/README.md
```

**Example categories**:
- `app_elements` - App-scoped elements
- `assets_and_media` - Asset uploads, DAM, fonts, image editing
- `content_replacement` - Replace text, images, videos
- `design_elements` - Design-scoped elements (shapes, text, tables, etc.)
- `design_interaction` - Design editing, export, page management
- `drag_and_drop` - Drag-and-drop for various element types
- `fundamentals` - Auth, fetch, feature support
- `intents` - Data connector intents
- `localization` - i18n examples
- `testing` - Unit and UI testing examples
- `ui` - UI Kit components (color, masonry, notifications)

### Using Canva Dev MCP Server

**Highly recommended** for AI assistants!

**Setup**: https://www.canva.dev/docs/apps/mcp-server/

**Benefits**:
- Component catalog and usage examples
- API reference and code snippets
- Best practices and patterns

**When to use**:
- Learning Canva APIs
- Finding component examples
- Understanding SDK capabilities

### Using Canva CLI

**Setup**: https://www.canva.dev/docs/apps/canva-cli.md

**Benefits**:
- Create apps from CLI
- Manage app configuration
- Quick preview workflow

---

## AI Assistant Guidelines

### Before Making Changes

1. **Read existing code** - Never propose changes to unread files
2. **Understand patterns** - Check `utils/` for reusable patterns
3. **Check examples** - Look for similar examples in `examples/`
4. **Verify feature support** - Use feature detection pattern
5. **Understand constraints** - Single file output, i18n requirements, etc.

### Best Practices

#### DO:
- ✅ Use `@canva/app-ui-kit` components (required for design compliance)
- ✅ Check feature support with `features.isSupported()`
- ✅ Use CSS Modules for styling
- ✅ Add i18n to all user-facing strings
- ✅ Follow existing patterns in `utils/`
- ✅ Test in Canva editor, not just locally
- ✅ Verify JWT middleware is initialized before backend routes
- ✅ Use path aliases (`styles/`, `utils/`, `assets/`)

#### DON'T:
- ❌ Hardcode strings without i18n
- ❌ Add features without checking support
- ❌ Use custom UI without App UI Kit
- ❌ Forget to update `CANVA_BACKEND_HOST` for production
- ❌ Create multiple chunks (single file constraint)
- ❌ Skip CORS configuration for backends
- ❌ Test only at `localhost:8080` (must test in Canva)

### Common Pitfalls

1. **Missing feature checks** - Always use `features.isSupported()`
2. **i18n violations** - ESLint will catch these, add `<FormattedMessage>` or `useIntl()`
3. **CORS errors** - Configure CORS with app origin
4. **JWT errors** - Ensure `CANVA_APP_ID` is set and middleware is initialized
5. **HMR not working** - Check `CANVA_APP_ORIGIN` is set and HMR is enabled
6. **Safari preview fails** - Use `npm start --use-https`

### File Organization

- **Business logic** → `src/` components
- **Reusable utilities** → `utils/`
- **Shared styles** → `styles/`
- **Backend code** → `utils/backend/` or example-specific `backend/`
- **Static assets** → `assets/`
- **Tests** → Co-located with source (e.g., `app.tests.tsx`)

### Code Review Checklist

Before suggesting code:
- [ ] Follows TypeScript strict mode
- [ ] Uses App UI Kit components
- [ ] Includes feature support checks
- [ ] Has i18n for user-facing strings
- [ ] Follows existing patterns
- [ ] Has proper error handling
- [ ] Includes TypeScript types
- [ ] Uses path aliases correctly
- [ ] Works with single-file output constraint
- [ ] CORS and JWT configured (if backend)

---

## Troubleshooting

### Development Server Won't Start

**Issue**: Port already in use

**Solution**:
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in .env
CANVA_FRONTEND_PORT=8081
```

### HMR Not Working

**Checklist**:
- [ ] `CANVA_HMR_ENABLED=TRUE` in `.env`
- [ ] `CANVA_APP_ORIGIN` matches Developer Portal origin
- [ ] Dev server restarted after `.env` changes
- [ ] App reloaded once in Canva after restart
- [ ] Not running in Docker (HMR incompatible)

### Safari Preview Fails

**Issue**: Mixed content blocked (HTTPS page loading HTTP script)

**Solution**:
```bash
# Start with HTTPS
npm start --use-https

# Update backend host
CANVA_BACKEND_HOST=https://localhost:3001

# Navigate to https://localhost:8080 and accept cert warning
# Update Developer Portal URL to https://localhost:8080
```

### Backend JWT Errors

**Common causes**:
- `CANVA_APP_ID` not set in `.env`
- JWT middleware not initialized before routes
- CORS blocking requests

**Debug**:
```ts
// Check JWT middleware is first
router.use(createJwtMiddleware(APP_ID)); // MUST BE BEFORE ROUTES
router.get("/my-route", ...); // Routes come after

// Log request
router.get("/debug", (req, res) => {
  console.log("Canva context:", req.canva);
  res.json(req.canva);
});
```

### Build Errors

**TypeScript errors**:
```bash
# Check types
npm run lint:types

# Common fixes
# - Add missing types from @canva/* packages
# - Check tsconfig.json paths are correct
```

**Webpack errors**:
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Example Won't Run

**Checklist**:
- [ ] Example has `package.json` (workspace requirement)
- [ ] Dependencies installed (`npm install` at root)
- [ ] Example name spelled correctly
- [ ] Backend example has `CANVA_APP_ID` in `.env`

### ESLint i18n Errors

**Error**: "String should be wrapped in FormattedMessage"

**Fix**:
```tsx
// ❌ Before
<Text>Hello World</Text>

// ✅ After
<Text>
  <FormattedMessage
    defaultMessage="Hello World"
    description="Greeting message"
  />
</Text>
```

---

## Quick Reference

### Essential Commands

```bash
npm start                    # Start boilerplate app
npm start <example>          # Start example
npm run build                # Production build
npm test                     # Run tests
npm run lint                 # Lint check
npm run format               # Format code
npm run lint:types           # Type check
```

### Essential Imports

```tsx
// UI Components
import { Button, Rows, Text, Title } from "@canva/app-ui-kit";

// Design APIs
import { addElementAtPoint, addElementAtCursor } from "@canva/design";

// Platform APIs
import { requestOpenExternalUrl, features } from "@canva/platform";

// Internationalization
import { FormattedMessage, useIntl } from "react-intl";

// Styles
import * as styles from "styles/components.css";
```

### File Paths

| Alias | Resolves To |
|-------|-------------|
| `assets` | `/assets` |
| `utils` | `/utils` |
| `styles` | `/styles` |
| `src` | `/src` |

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `CANVA_APP_ID` | App identifier | `AABBccddeeff` |
| `CANVA_APP_ORIGIN` | App origin for HMR | `https://app-aabbccddeeff.canva-apps.com` |
| `CANVA_BACKEND_HOST` | Backend URL | `http://localhost:3001` |
| `CANVA_HMR_ENABLED` | Enable HMR | `TRUE` / `FALSE` |
| `CANVA_FRONTEND_PORT` | Dev server port | `8080` |
| `CANVA_BACKEND_PORT` | Backend port | `3001` |

### Global Constants

| Constant | Source | Usage |
|----------|--------|-------|
| `BACKEND_HOST` | `CANVA_BACKEND_HOST` env var | `fetch(\`${BACKEND_HOST}/route\`)` |

---

## Additional Resources

- **Canva Apps Docs**: https://www.canva.dev/docs/apps/
- **Developer Portal**: https://www.canva.com/developers/apps
- **MCP Server Setup**: https://www.canva.dev/docs/apps/mcp-server/
- **Canva CLI Docs**: https://www.canva.dev/docs/apps/canva-cli.md
- **GitHub Issues**: https://github.com/canva-sdks/canva-apps-sdk-starter-kit/issues

---

**Last Updated**: 2025-12-21
**SDK Version**: Apps SDK Starter Kit (React 19, App UI Kit v5)
**Node Requirement**: v18 or v20.10.0

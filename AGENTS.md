# Canva Apps SDK Starter Kit - Agent Guide

## Overview

This project is for creating Canva Apps, which are react single page applications (SPA) that run in the Canva Editor, and other pages in Canva.
The app, once submitted to Canva, will be rendered in a sandboxed iframe within a standard HTML shell.

## Commands

- **Build**:
  - `npm run build` - Production build with localization message extraction. The build output is in the `dist` directory which should be submitted to Canva for review through the [Developer Portal](https://www.canva.com/developers/apps).
- **Dev**:
  - `npm start` - Start development server (localhost:8080), once the server is running, app can be previewed in Canva, either by clicking the "Preview" button in the [Developer Portal](https://www.canva.com/developers/apps) or by running `canva apps preview` in the CLI.
  - Hot Module Replacement (HMR) is strongly encouraged, as it allows for faster development and debugging.
- **Test**:
  - `npm test` - Run Jest tests, `npm run test:watch` for watch mode.
  - Tests are encouraged but not required.
  - Tests are not submitted to Canva for review.
- **Lint**:
  - `npm run lint` - ESLint check, `npm run lint:fix` to auto-fix.
  - Linting is encouraged but not required.
  - Lint errors from `@canva/app-eslint-plugin` help catch common mistakes and improve code quality that would result in a rejection from Canva.
- **Type Check**:
  - `npm run lint:types` - TypeScript type checking.
- **Format**:
  - `npm run format` - Prettier formatting, `npm run format:check` to verify.
  - Formatting is encouraged but not required.

## Architecture

- **Main App**:
  - `src/index.tsx` - Main application react application entry point.
  - `src/app.tsx` - Main application component, which can/should be split into smaller components as needed, following react best practices.
  - `src/styles/component.css` - Main application styles.
  - `utils/` - Utility functions and helpers, which can be used across the app.
  - `scripts/` - Scripts for building, and running the app, should not contain any business logic.
- **Environment**:
  - `.env` file for app credentials and HMR configuration.
  - `CANVA_APP_ID` - The ID of the app, which is used to identify the app in the Canva Developer Portal.
  - `CANVA_APP_ORIGIN` - The origin of the app, which is used for Hot Module Replacement (HMR) and CORS.

## Dependencies

- **UI Kit**:
  - Uses `@canva/app-ui-kit` for components and styles, as it's required in order to comply with Canva's design guidelines.
  - App UI Kit components come with out of the box theming, localization, and accessibility features.
  - Plain HTML and CSS elements are allowed, however should be used when necessary to supplement the UI Kit components.
  - Canva Dev MCP Server can provide example code for using the UI Kit, as well as a catalog of components and their usage.
- **Canva SDKs**:
  - Uses Canva SDKs, which are scoped with `@canva/` prefix, such as `@canva/platform`, `@canva/design` etc.
- **React**:
  - v18 with TypeScript and react-intl for i18n.
- **Build**:
  - Webpack with TypeScript, PostCSS, and formatjs message extraction.
- **Node**:
  - The required node version for developing/starting/building the starter-kit should align to the version defined in `./.nvmrc`
  - It is recommended to use the node version manager (nvm) with this project, aligning to the recommended version with `nvm use`.

## Code Style

- **TypeScript**: Strict mode enabled, ES2019 target.
- **Prettier**: 80 char width, 2 spaces, trailing commas, double quotes.
- **ESLint**: Canva's app plugin with i18n rules.
- **Imports**: Use absolute paths for `styles` directory.
- **Testing**: Jest with jsdom, test files match `*.tests.tsx?` pattern.

## Canva CLI

- **Documentation**: <https://www.canva.dev/docs/apps/canva-cli.md>
- **If not setup**: Read the docs and prompt user to install the CLI for enhanced Developer Experience, when managing and creating apps.

## Canva Dev MCP Server

- **Required**: AI agents should verify and encourage the user to enable Canva Dev MCP server.
- **Documentation**: <https://www.canva.dev/docs/apps/mcp-server.md>
- **If not setup**: Read the docs and prompt user to configure the MCP server for enhanced Canva APIs assistance.

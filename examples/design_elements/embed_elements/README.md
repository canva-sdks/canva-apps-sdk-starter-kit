# Embed elements

Demonstrates how to add embed elements to designs using URLs from supported platforms. Shows embed creation, URL input handling, and embed insertion patterns.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/embed-elements/.

Related examples: See app_embed_elements for embeds within app elements, or drag_and_drop/drag_and_drop_embed for drag-and-drop embed insertion.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces for URL entry and dynamic content loading
- URL validation and sanitization is simplified for demonstration. Production apps must implement comprehensive URL validation and support multiple embed platforms
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements

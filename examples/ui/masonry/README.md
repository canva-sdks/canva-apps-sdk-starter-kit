# UI masonry layout

Demonstrates how to implement a masonry grid layout for displaying images with drag-and-drop functionality and infinite scrolling. Shows advanced UI patterns for browsing and selecting assets.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/masonry/>.

Related examples: See drag_and_drop/drag_and_drop_image for image drag-and-drop, or assets_and_media/digital_asset_management for asset browsing patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Mock data and static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Image optimization and loading states are not implemented. Production apps should optimize images and provide loading feedback for better user experience
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements

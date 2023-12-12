const { canva } = window;
/**
 * @public
 * Opens an external URL.
 *
 * @remarks
 * The URL is opened natively, such as in a new browser tab on desktop or in a browser sheet on mobile.
 *
 * In some browsers, the user must enable popup permissions before any URL can be opened.
 */
export function requestOpenExternalUrl(request) {
    return canva.platform.requestOpenExternalUrl(request);
}
/**
 * @public
 * Returns information about the platform on which the app is running.
 */
export function getPlatformInfo() {
    return canva.platform.getPlatformInfo();
}

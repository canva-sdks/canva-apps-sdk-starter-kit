"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformInfo = exports.requestOpenExternalUrl = void 0;
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
function requestOpenExternalUrl(request) {
    return canva.platform.requestOpenExternalUrl(request);
}
exports.requestOpenExternalUrl = requestOpenExternalUrl;
/**
 * @public
 * Returns information about the platform on which the app is running.
 */
function getPlatformInfo() {
    return canva.platform.getPlatformInfo();
}
exports.getPlatformInfo = getPlatformInfo;

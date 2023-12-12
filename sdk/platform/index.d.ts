/**
 * @public
 * Returns information about the platform on which the app is running.
 */
export declare function getPlatformInfo(): PlatformInfo;

/**
 * @public
 * The result of opening an external URL when a user chooses to not navigate away from Canva.
 */
export declare type OpenExternalUrlAborted = {
  /**
   * The status of the request.
   */
  status: "ABORTED";
};

/**
 * @public
 * The result of opening an external URL when a user agrees to navigate away from Canva.
 */
export declare type OpenExternalUrlCompleted = {
  /**
   * The status of the request.
   */
  status: "COMPLETED";
};

/**
 * @public
 * The options for opening an external URL.
 */
export declare type OpenExternalUrlRequest = {
  /**
   * The URL to open in a new window
   */
  url: string;
};

/**
 * @public
 * The result of opening an external URL.
 */
export declare type OpenExternalUrlResponse =
  | OpenExternalUrlCompleted
  | OpenExternalUrlAborted;

/**
 * @public
 * Information about the platform on which the app is running.
 */
export declare type PlatformInfo = {
  /**
   * If `true`, the app is allowed to directly link to payment and upgrade flows.
   *
   * @remarks
   * This property is always `true` when the app is running in a web browser, but may otherwise be `false` in
   * order to comply with the policies of the platforms on which Canva is available. For example, some platforms
   * only allow payment-related actions that use their own payment mechanisms and apps are therefore not allowed
   * to render payment-related call-to-actions while running on those platforms.
   *
   * @example
   * const info = getPlatformInfo();
   *
   * if (info.canAcceptPayments) {
   *   // Display payment links and upgrade flows
   * } else {
   *   // Hide payment links and upgrade flows
   *   // Optionally show an appropriate message
   * }
   */
  canAcceptPayments: boolean;
};

/**
 * @public
 * Opens an external URL.
 *
 * @remarks
 * The URL is opened natively, such as in a new browser tab on desktop or in a browser sheet on mobile.
 *
 * In some browsers, the user must enable popup permissions before any URL can be opened.
 */
export declare function requestOpenExternalUrl(
  request: OpenExternalUrlRequest
): Promise<OpenExternalUrlResponse>;

export {};

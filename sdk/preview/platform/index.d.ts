/**
 * @public
 * An API for interacting with the App Process.
 */
export declare interface AppProcess {
  readonly current: CurrentAppProcess;
  /**
   * @public
   * Request the termination of an app process.
   * @param target - The id of the app process to close.
   * @param params - A parameters object passed to all callback functions registered via registerOnBeforeClose API for the provided AppProcessId.
   * In addition to the required 'reason' field, app can choose to pass any structured data via params.
   * {@link https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data | safe passing of structured data}
   * @remarks
   * A successful invocation indicates the platform has begun shutdown following procedure for the target AppProcessId, which:
   * 1. Transitions process state to `CLOSING`, triggering all registered state change callbacks.
   * 2. Invokes all registered onBeforeClose callbacks.
   * 3. Waits for the process to close.
   * 4. Transitions process state to `CLOSED`, triggering all registered state change callbacks.
   * @remarks
   * Once initiated, the closing process is irreversible and the process will NOT receive any events or messages from other processes.
   */
  requestClose<T extends CloseParams>(
    target: AppProcessId,
    params: T
  ): Promise<void>;
  /**
   * @public
   * Registers a callback to be executed when the state of the specified app process changes.
   * @param target - The id of the app process for which to register the callback.
   * @param callback - Callback function triggered on state change
   * @returns a disposer function to unsubscribe the callback.
   */
  registerOnStateChange(
    target: AppProcessId,
    callback: (opts: { state: ProcessState }) => void
  ): () => Promise<void>;
  /**
   * Registers a handler to receive messages sent from other app processes.
   * @param callback - Handler function to receive incoming messages.
   * @returns a disposer function to unsubscribe the handler.
   */
  registerOnMessage(
    callback: (
      sender: {
        appProcessId: AppProcessId;
        surface: AppSurface;
      },
      message: any
    ) => void
  ): () => Promise<void>;
  /**
   * Broadcasts a message to all other running app processes which share the caller's AppId.
   * @param message - app-defined message to be broadcast. message needs to be structured data.
   */
  broadcastMessage(message: any): void;
}

/**
 * An alias for the AppProcess interface for interacting with the App Process.
 * @public
 */
export declare const appProcess: AppProcess;

/**
 * @public
 * The unique identifier for an app process.
 */
export declare type AppProcessId = string & {
  __appProcessId: never;
};

/**
 * @public
 * Information about an app process.
 */
export declare type AppProcessInfo<T> = {
  /**
   * The surface on which the app is running.
   */
  surface: AppSurface;
  /**
   * The unique identifier of the app process.
   */
  processId: AppProcessId;
  /**
   * The parameters provided to the app at the time of its process launch.
   */
  launchParams?: T;
};

/**
 * @public
 * The types of surfaces that can run an app process.
 */
export declare type AppSurface =
  /**
   * The object panel on the left side of the editing UI.
   */
  | "object_panel"
  /**
   * The overlay surface on top of a selected image in the design.
   */
  | "selected_image_overlay";

/**
 * @public
 * The parameters specified when closing an app process.
 * @remarks
 * CloseParams are passed on to the callback function registered for handling the termination of an app process,
 * and provide additional context for ending the process.
 * For example, Apps should persist unsaved changes when the close reason is 'completed'.
 */
export declare type CloseParams = {
  reason: CloseReason;
};

/**
 * @public
 * The reasons why an app process is closed.
 */
export declare type CloseReason =
  /**
   * Indicates the workflow is completed, for example, when user clicks a 'Save and Close' in the App.
   * Any unsaved changes should be saved before closing.
   */
  | "completed"
  /**
   * Indicates user has aborted the workflow, for example, when user clicked the 'cancel' button in the App.
   * App should be closed without saving any current changes.
   */
  | "aborted";

/**
 * @public
 * Represents and exposes functionality specific to the currently running app process.
 */
export declare type CurrentAppProcess = {
  /**
   * @public
   * Retrieves information about the current app process.
   */
  getInfo<T extends any>(): AppProcessInfo<T>;
  /**
   * @public
   * Requests the current app process be closed.
   * @param params - A parameters object passed to all callback functions registered via registerOnBeforeClose API for the current process.
   * In addition to the required 'reason' field, app can choose to pass any structured data via params.
   * @remarks
   * A successful invocation indicates the platform has begun shutdown following procedure for the current process, which:
   * 1. Transitions process state to `CLOSING`, triggering all registered state change callbacks.
   * 2. Invokes all registered onBeforeClose callbacks.
   * 3. Waits for the process to close.
   * 4. Transitions process state to `CLOSED`, triggering all registered state change callbacks.
   * @remarks
   * Once initiated, the closing process is irreversible and the process will NOT receive any events or messages from other processes.
   */
  requestClose<T extends CloseParams>(params: T): Promise<void>;
  /**
   * @public
   * Registers a callback to be executed when the current app process is about to close.
   * @remarks Only allow registering one callback.
   * Subsequential invokes of the API will override the existing callback.
   * The process remains open until the callback resolve or a timeout occurs.
   * @param callback -  The callback function to be invoked before closure.
   * @returns a disposer function to unsubscribe the callback.
   * @remarks Complete execution of the callback is not guaranteed. Certain user actions (e.g. closing tabs, top level navigation) may terminate app processes prematurely. Consider these callbacks **best effort only.**
   */
  setOnDispose<T extends CloseParams>(
    callback: OnDisposeCallback<T>
  ): () => Promise<void>;
};

/**
 * @public
 * Returns information about the platform on which the app is running.
 */
export declare function getPlatformInfo(): PlatformInfo;

/**
 * @public
 * The type of a callback that is invoked when an app process is being closed.
 * @returns a promise.
 */
export declare type OnDisposeCallback<T extends CloseParams> = (
  opts: T
) => Promise<void>;

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
 * The states are an app process.
 */
export declare type ProcessState =
  /**
   * The app process is in the process of opening.
   */
  | "opening"
  /**
   * The app process is active and visible to the user on its designated surface.
   */
  | "open"
  /**
   * The app process is in the process of closing.
   * At this state, the process becomes non-interactive and won't receive any events and messages from other processes.
   */
  | "closing"
  /**
   * The app process has been terminated and is no longer running.
   */
  | "closed";

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

declare interface BaseCanvaError extends Error {
  code: ErrorCode;
}

/**
 * @public
 * Base Error thrown by Canva API clients
 */
export declare class CanvaError extends Error implements BaseCanvaError {
  readonly code: ErrorCode;

  constructor(opts: { code: ErrorCode; message: string });
}

/**
 * @public
 * Error codes that could be thrown by Canva SDK clients
 */
export declare type ErrorCode =
  /**
   * The system is currently unable to perform the requested operation because it is not in the necessary state.
   * Refer to the error message for more information on how to satisfy the failed precondition.
   */
  | "FAILED_PRECONDITION"
  /**
   * The response received from an external service is invalid or malformed.
   */
  | "BAD_EXTERNAL_SERVICE_RESPONSE"
  /**
   * The request received from the client is invalid or malformed.
   */
  | "BAD_REQUEST"
  /**
   * An error occurred within the SDK's internal implementation.
   */
  | "INTERNAL_ERROR"
  /**
   * The allocated quota for the resource or service has been exceeded.
   */
  | "QUOTA_EXCEEDED"
  /**
   * The system has received too many requests in a short period of time.
   */
  | "RATE_LIMITED"
  /**
   * The caller does not have sufficient permissions to execute the specified operation.
   */
  | "PERMISSION_DENIED"
  /**
   * The user is currently offline and cannot perform the requested operation.
   */
  | "USER_OFFLINE"
  /**
   * The specified resource was not found
   */
  | "NOT_FOUND"
  /**
   * The operation exceeded the maximum allowed time to complete.
   */
  | "TIMEOUT";

export {};

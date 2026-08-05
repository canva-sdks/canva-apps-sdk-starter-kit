/** Categorizes the errors surfaced via `AppContextType.appError`. */
export enum AppErrorType {
  None = "none",
  General = "general",
  GetRemainingCreditsFailed = "getRemainingCreditsFailed",
  GeneratingImagesFailed = "generatingImagesFailed",
  PromptObscenity = "promptObscenity",
}

/** Categorizes the errors surfaced via `AppContextType.creditsError`. */
export enum CreditsErrorType {
  None = "none",
  NotEnoughCredits = "notEnoughCredits",
}

/** Categorizes the errors surfaced via `AppContextType.promptInputError`. */
export enum PromptInputErrorType {
  None = "none",
  PromptMissing = "promptMissing",
}

import type { JSX } from "react";
import { createContext, useEffect, useState } from "react";
import type { ImageType } from "src/api/api";
import { getRemainingCredits } from "src/api/api";
import {
  AppErrorType,
  CreditsErrorType,
  PromptInputErrorType,
} from "./error_type";

export interface AppContextType {
  appError: AppErrorType;
  setAppError: (value: AppErrorType) => void;
  creditsError: CreditsErrorType;
  setCreditsError: (value: CreditsErrorType) => void;
  loadingApp: boolean;
  setLoadingApp: (value: boolean) => void;
  isLoadingImages: boolean;
  setIsLoadingImages: (value: boolean) => void;
  jobId: string;
  setJobId: (value: string) => void;
  remainingCredits: number;
  setRemainingCredits: (value: number) => void;
  promptInput: string;
  setPromptInput: (value: string) => void;
  promptInputError: PromptInputErrorType;
  setPromptInputError: (value: PromptInputErrorType) => void;
  generatedImages: ImageType[];
  setGeneratedImages: (value: ImageType[]) => void;
}

export const AppContext = createContext<AppContextType>({
  appError: AppErrorType.None,
  setAppError: () => {},
  creditsError: CreditsErrorType.None,
  setCreditsError: () => {},
  loadingApp: true,
  setLoadingApp: () => {},
  isLoadingImages: false,
  setIsLoadingImages: () => {},
  jobId: "",
  setJobId: () => {},
  remainingCredits: 0,
  setRemainingCredits: () => {},
  promptInput: "",
  setPromptInput: () => {},
  promptInputError: PromptInputErrorType.None,
  setPromptInputError: () => {},
  generatedImages: [] as ImageType[],
  setGeneratedImages: () => {},
});

/**
 * Provides application-wide state and methods using React Context.
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The children components wrapped by the provider.
 * @returns {JSX.Element} The provider component.
 * @description This provider component wraps the entire application to provide application-wide state and methods using React Context.
 * It manages state related to app errors, loading status, remaining credits, user input for prompts, image styles, and generated images.
 * It exposes these state values and setter methods to its child components via the AppContext.
 * For more information on React Context, refer to the official React documentation: {@link https://react.dev/learn/passing-data-deeply-with-context}.
 */
export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [appError, setAppError] = useState<AppErrorType>(AppErrorType.None);
  const [loadingApp, setLoadingApp] = useState<boolean>(true); // set to true to prevent ui flash on load
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string>("");
  const [remainingCredits, setRemainingCredits] = useState<number>(0);
  const [promptInput, setPromptInput] = useState<string>("");
  const [promptInputError, setPromptInputError] =
    useState<PromptInputErrorType>(PromptInputErrorType.None);
  const [generatedImages, setGeneratedImages] = useState<ImageType[]>([]);
  const [creditsError, setCreditsError] = useState<CreditsErrorType>(
    CreditsErrorType.None,
  );

  // Fetches initial data on component mount
  useEffect(() => {
    const fetchDataOnMount = async () => {
      try {
        setLoadingApp(true);

        // Fetch remaining credits
        try {
          const { credits } = await getRemainingCredits();
          setRemainingCredits(credits);
        } catch (error) {
          setAppError(AppErrorType.GetRemainingCreditsFailed);
          // eslint-disable-next-line no-console
          console.error("Error fetching remaining credits:", error);
        }
      } catch (error) {
        setAppError(AppErrorType.General);
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchDataOnMount();
  }, [setAppError]);

  // Clears the not-enough-credits alert once the user has credits again
  // (e.g. after purchasing more). Setting the alert itself is handled by
  // the Generate button's click handler in footer.tsx, so it only appears
  // once the user has actually tried to generate with no credits left.
  useEffect(() => {
    if (remainingCredits > 0) {
      setCreditsError(CreditsErrorType.None);
    }
  }, [remainingCredits]);

  const setPromptInputHandler = (value: string) => {
    if (
      promptInputError === PromptInputErrorType.PromptMissing ||
      value === ""
    ) {
      setPromptInputError(PromptInputErrorType.None);
    }

    setPromptInput(value);
  };

  const value: AppContextType = {
    appError,
    setAppError,
    creditsError,
    setCreditsError,
    loadingApp,
    setLoadingApp,
    isLoadingImages,
    setIsLoadingImages,
    jobId,
    setJobId,
    remainingCredits,
    setRemainingCredits,
    promptInput,
    setPromptInput: setPromptInputHandler,
    promptInputError,
    setPromptInputError,
    generatedImages,
    setGeneratedImages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

import { Rows } from "@canva/app-ui-kit";
import { AppError } from "src/components/app_error";
import { ImageGrid } from "src/components/image_grid";
import { LoadingResults } from "src/components/loading_results";
import { PromptInput } from "src/components/prompt_input";
import { ReportBox } from "src/components/report_box";
import { EXPECTED_LOADING_TIME_IN_SECONDS } from "src/config";
import { useAppContext } from "src/context/use_app_context";

export const ResultsPage = () => {
  const { isLoadingImages } = useAppContext();

  if (isLoadingImages) {
    return (
      <LoadingResults durationInSeconds={EXPECTED_LOADING_TIME_IN_SECONDS} />
    );
  }

  return (
    <Rows spacing="1u">
      <AppError />
      <Rows spacing="2u">
        <ImageGrid />
        <PromptInput />
        <ReportBox />
      </Rows>
    </Rows>
  );
};

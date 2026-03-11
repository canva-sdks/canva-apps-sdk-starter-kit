import { Rows } from "@canva/app-ui-kit";
import { AppError } from "src/components/app_error";
import { PromptInput } from "src/components/prompt_input";

export const GeneratePage = () => (
  <Rows spacing="1u">
    <AppError />
    <PromptInput />
  </Rows>
);

import { Rows } from "@canva/app-ui-kit";
import { AppError, PromptInput } from "src/components";

export const GeneratePage = () => (
  <Rows spacing="1u">
    <AppError />
    <PromptInput />
  </Rows>
);

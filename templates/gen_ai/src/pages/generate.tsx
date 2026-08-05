import { Rows } from "@canva/app-ui-kit";
import { AppError } from "src/components/app_error";
import { CreditError } from "src/components/credit_error";
import { PromptInput } from "src/components/prompt_input";
import { StyleCarousel } from "src/components/style_carousel";

export const GeneratePage = () => (
  <Rows spacing="3u">
    <AppError />
    <PromptInput />
    <StyleCarousel />
    <CreditError />
  </Rows>
);

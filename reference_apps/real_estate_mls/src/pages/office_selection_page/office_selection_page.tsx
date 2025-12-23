import {
  Avatar,
  Box,
  Button,
  FormField,
  Rows,
  Select,
  Text,
} from "@canva/app-ui-kit";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { mockUserData, offices } from "../../data";

type FormValues = {
  office: string;
  agent: string;
};

export const OfficeSelectionPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { touchedFields, isSubmitted },
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      office: "",
    },
    criteriaMode: "all",
  });

  const selectedOffice = watch("office");

  const onSubmit = (data: FormValues) => {
    const office = offices.find((o) => o.id === data.office);
    if (office) {
      navigate(`/loading`, { state: { office } });
    }
  };

  return (
    <Box paddingY="2u" height="full">
      <Box
        height="full"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Rows spacing="2u">
            <FormField
              label={intl.formatMessage({
                defaultMessage: "Office",
                description: "Label for office selection dropdown",
              })}
              error={
                touchedFields.office &&
                !selectedOffice &&
                intl.formatMessage({
                  defaultMessage: "Please select an office",
                  description: "Error message when office is not selected",
                })
              }
              control={(props) => (
                <Select
                  {...props}
                  stretch
                  options={offices.map((office) => ({
                    label: office.name,
                    value: office.id,
                  }))}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select office",
                    description: "Placeholder text for office selection",
                  })}
                  onChange={(value) => {
                    setValue("office", value, {
                      shouldValidate: true,
                    });
                  }}
                  value={selectedOffice}
                />
              )}
            />
            <Rows spacing="0.5u">
              <Button
                variant="primary"
                stretch
                type="submit"
                disabled={isSubmitted && !selectedOffice}
              >
                {intl.formatMessage({
                  defaultMessage: "Continue",
                  description: "Button text to proceed with selection",
                })}
              </Button>
              {isSubmitted && !selectedOffice && (
                <Text variant="regular" tone="critical">
                  {intl.formatMessage({
                    defaultMessage: "Please select an office and agent",
                    description:
                      "Text to prompt user to select office and agent",
                  })}
                </Text>
              )}
            </Rows>
          </Rows>
        </form>

        <Box paddingTop="4u">
          <Rows spacing="1u">
            <Text variant="bold">
              {intl.formatMessage({
                defaultMessage: "Account",
                description: "Section header for account information",
              })}
            </Text>
            <Rows spacing="1u" align="start">
              <Box display="flex" alignItems="start">
                <Box paddingEnd="1u">
                  <Avatar
                    photo={mockUserData.userAvatarUrl}
                    name={mockUserData.userName || ""}
                  />
                </Box>
                <Rows spacing="0">
                  <Text>{mockUserData.userName}</Text>
                  <Text variant="regular" tone="secondary">
                    {mockUserData.userEmail}
                  </Text>
                </Rows>
              </Box>
            </Rows>
          </Rows>
        </Box>
      </Box>
    </Box>
  );
};

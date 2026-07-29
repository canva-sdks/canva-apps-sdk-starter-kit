// For usage information, see the README.md file.
import { Alert, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import type { BrandTemplateId, BrandTemplateMetadata } from "@canva/design";
import {
  applyTemplate,
  getBrandTemplateMetadata,
  requestBrandTemplates,
} from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";
// Canva SDK for accessing user authentication
import { auth } from "@canva/user";

// Data the backend returns for a brand template. brandTemplateId is decoded
// and verified server-side from the token — see backend/server.ts — since
// the raw token from requestBrandTemplates isn't itself a usable
// BrandTemplateId. applyCount is tracked per-brand.
type BrandTemplateData = {
  brandTemplateId: BrandTemplateId;
  applyCount: number;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "preview";
      token: string;
      metadata: BrandTemplateMetadata;
      data: BrandTemplateData;
    }
  | {
      status: "applying";
      token: string;
      metadata: BrandTemplateMetadata;
      data: BrandTemplateData;
    };

export function App() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [error, setError] = useState<string | null>(null);

  // Sends the brand template token to the backend, where
  // brandTemplate.verifyToken() decodes and verifies it before returning the
  // real brandTemplateId, along with how many times this brand has applied
  // the template.
  const getBrandTemplateData = async (
    brandTemplateToken: string,
  ): Promise<BrandTemplateData> => {
    const authToken = await auth.getCanvaUserToken();
    const response = await fetch(
      `${BACKEND_HOST}/brand-template?brandTemplateToken=${brandTemplateToken}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    return response.json();
  };

  const handleChooseTemplate = async () => {
    setError(null);
    setState({ status: "loading" });
    try {
      const response = await requestBrandTemplates();
      if (response.status === "aborted") {
        setState({ status: "idle" });
        return;
      }

      // The token is an opaque, signed JWT — not itself a usable
      // BrandTemplateId. It's sent to the backend, where
      // brandTemplate.verifyToken() confirms it's a genuine, unmodified
      // token issued by Canva for this app, and decodes it into the real ID,
      // which is what the client-side calls below need.
      const token = response.brandTemplates[0]?.token;
      if (!token) {
        setState({ status: "idle" });
        setError("No brand template was selected.");
        return;
      }

      const data = await getBrandTemplateData(token);
      const metadata = await getBrandTemplateMetadata(data.brandTemplateId);
      setState({ status: "preview", token, metadata, data });
    } catch (err) {
      setState({ status: "idle" });
      setError(
        err instanceof Error ? err.message : "Failed to load brand template.",
      );
    }
  };

  const handleApplyTemplate = async () => {
    if (state.status !== "preview") return;
    const { token, metadata, data } = state;
    setError(null);
    setState({ status: "applying", token, metadata, data });
    try {
      const result = await applyTemplate({
        template: { id: data.brandTemplateId },
        mode: "overwrite",
      });
      if (result.status === "aborted") {
        setState({ status: "preview", token, metadata, data });
        return;
      }

      // Record the successful apply against the brand template. The backend
      // re-verifies the token via brandTemplate.verifyToken() before
      // trusting the brand template ID, rather than accepting it as a plain
      // request parameter.
      const authToken = await auth.getCanvaUserToken();
      await fetch(
        `${BACKEND_HOST}/brand-template?brandTemplateToken=${token}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "POST",
        },
      );

      const refreshedData = await getBrandTemplateData(token);
      setState({
        status: "preview",
        token,
        metadata,
        data: refreshedData,
      });
    } catch (err) {
      setState({ status: "preview", token, metadata, data });
      setError(
        err instanceof Error ? err.message : "Failed to apply template.",
      );
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>Brand templates</Title>
        <Text>
          Pick a brand template, preview its dataset fields, then apply it to
          the current design.
        </Text>
        <Button
          variant="primary"
          onClick={handleChooseTemplate}
          loading={state.status === "loading"}
          stretch
        >
          Choose brand template
        </Button>
        {error && <Alert tone="critical">{error}</Alert>}
        {(state.status === "preview" || state.status === "applying") && (
          <TemplatePreview
            metadata={state.metadata}
            data={state.data}
            isApplying={state.status === "applying"}
            onApply={handleApplyTemplate}
          />
        )}
      </Rows>
    </div>
  );
}

function TemplatePreview({
  metadata,
  data,
  isApplying,
  onApply,
}: {
  metadata: BrandTemplateMetadata;
  data: BrandTemplateData;
  isApplying: boolean;
  onApply: () => void;
}) {
  const dataset = metadata.dataset ?? [];
  return (
    <Rows spacing="1u">
      {metadata.keywords.length > 0 && (
        <Text tone="secondary" size="small">
          Keywords: {metadata.keywords.join(", ")}
        </Text>
      )}
      {dataset.length === 0 ? (
        <Text tone="secondary">This template has no dataset fields.</Text>
      ) : (
        <Rows spacing="0.5u">
          <Text size="small" tone="secondary">
            Dataset fields:
          </Text>
          {dataset.map((field) => (
            <Text key={field.label} size="small">
              {`• ${field.label} (${field.type})`}
            </Text>
          ))}
        </Rows>
      )}
      <Text tone="secondary" size="small">
        Applied {data.applyCount} time{data.applyCount === 1 ? "" : "s"} by this
        brand, as tracked by the backend using the decoded brand template ID.
      </Text>
      <Button variant="primary" onClick={onApply} loading={isApplying} stretch>
        Apply template
      </Button>
    </Rows>
  );
}

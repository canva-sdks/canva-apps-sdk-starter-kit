import { prepareContentPublisher } from "@canva/intents/content";
import { prepareDataConnector } from "@canva/intents/data";
import { prepareDesignEditor } from "@canva/intents/design";

import contentPublisher from "./intents/content_publisher";
import dataConnector from "./intents/data_connector";
import designEditor from "./intents/design_editor";

// All intents must be registered eagerly at app load — Canva may invoke
// any intent's callbacks regardless of which screen is currently rendered.

// Publish designs to external listing platforms
prepareContentPublisher(contentPublisher);
// Generate & autofill designs in bulk from MLS listing data
prepareDataConnector(dataConnector);
// Main design editing experience for creating listing materials
prepareDesignEditor(designEditor);

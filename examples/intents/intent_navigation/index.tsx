// For usage information, see the README.md file.
// This root index file contains the prepare function calls that initialize each intent.
// Each intent entrypoint is respondible for exporting the intent contract implementation.
import { prepareContentPublisher } from "@canva/intents/content";
import { prepareDesignEditor } from "@canva/intents/design";
import { prepareDataConnector } from "@canva/intents/data";

import dataConnector from "./intents/data_connector";
import contentPublisher from "./intents/content_publisher";
import designEditor from "./intents/design_editor";

prepareDataConnector(dataConnector);
prepareContentPublisher(contentPublisher);
prepareDesignEditor(designEditor);

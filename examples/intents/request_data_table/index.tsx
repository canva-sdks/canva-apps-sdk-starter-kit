// For usage information, see the README.md file.
// This root index file contains the prepare function calls that initialize each intent.
// Each intent entrypoint is responsible for exporting the intent contract implementation.
import { prepareDataConnector } from "@canva/intents/data";
import { prepareDesignEditor } from "@canva/intents/design";

import dataConnector from "./intents/data_connector";
import designEditor from "./intents/design_editor";

prepareDataConnector(dataConnector);
prepareDesignEditor(designEditor);

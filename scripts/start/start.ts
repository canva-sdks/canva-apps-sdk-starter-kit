#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from "yargs";
import { AppRunner, errorChalk } from "./app_runner";
import { hideBin } from "yargs/helpers";
import { Context } from "./context";
import prompts from "prompts";

const appRunner = new AppRunner();

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("ngrok", {
    description: "Run backend server via ngrok.",
    type: "boolean",
    // npm swallows command line args instead of forwarding to the script
    default:
      process.env.npm_config_ngrok?.toLocaleLowerCase().trim() === "true",
  })
  .option("use-https", {
    description: "Start local development server on HTTPS.",
    type: "boolean",
    // npm swallows commands line args instead of forwarding to the script
    default:
      process.env.npm_config_use_https?.toLocaleLowerCase().trim() === "true",
  })
  .option("override-frontend-port", {
    description:
      "Port to run the local development server on. Overrides the frontend port set in the .env file.",
    type: "number",
    alias: "p",
  })
  .option("preview", {
    description: "Open the app in Canva.",
    type: "boolean",
    default: false,
  })
  .command(
    "$0 [example]",
    "Starts a local development for the app in /src, or an example app if specified",
    (yargs) => {
      return yargs.positional("example", {
        describe: "The example app to run",
        type: "string",
      });
    },
    async (args) => {
      // If example was provided but not in the list, search for matches
      if (args.example && !Context.examples.includes(args.example)) {
        const matches = Context.examples.filter(
          (ex) =>
            // if the example name is provided without a category, we can match on the full name
            ex.endsWith("/" + args.example) ||
            ex.split("/").pop() === args.example,
        );

        if (matches.length === 0) {
          console.log(`No example found matching '${args.example}'.`);
          process.exit(1);
        }

        if (matches.length === 1) {
          // if there is only one match, we can use it
          // e.g. if the example was "fetch", we can run "getting_started/fetch"
          args.example = matches[0];
        } else if (matches.length > 1) {
          console.log(`Multiple examples found matching '${args.example}':`);

          // Prompt the user to choose from multiple matching examples
          const { selectedExample } = await prompts(
            {
              type: "select",
              name: "selectedExample",
              message: "Please select the example you want to run:",
              choices: matches.map((match) => ({
                title: match,
                value: match,
              })),
            },
            {
              onCancel: () => {
                console.log(errorChalk("Aborted by the user."));
                process.exit(0);
              },
            },
          );

          if (selectedExample) {
            args.example = selectedExample;
          } else {
            console.log(`No example selected. Exiting.`);
            process.exit(1);
          }
        }
      }

      const ctx = new Context(process.env, args);
      appRunner.run(ctx);
    },
  )
  .command(
    "examples",
    "Displays a list of available examples to choose from",
    () => {},
    async (args) => {
      const { example } = await prompts(
        {
          type: "autocomplete",
          name: "example",
          message: "Which example would you like to run?",
          choices: Context.examples.map((example) => ({
            title: example.replace(/_/g, " ").replace(/\//g, " > "),
            value: example,
          })),
          suggest: async (input, choices) =>
            choices.filter((choice) =>
              choice.title.toLowerCase().includes(input.toLowerCase()),
            ),
        },
        {
          onCancel: () => {
            console.log(errorChalk("Aborted by the user."));
            process.exit(0);
          },
        },
      );

      if (example == null) {
        console.log(`${errorChalk("Error:")} No such example exists 😢`);
        process.exit(1);
      }

      const ctx = new Context(process.env, { ...args, example });
      appRunner.run(ctx);
    },
  )
  .parse();

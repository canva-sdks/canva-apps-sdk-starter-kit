#!/usr/bin/env node
import * as yargs from "yargs";
import { AppRunner, errorChalk } from "./app_runner";
import { hideBin } from "yargs/helpers";
import { Context } from "./context";
import * as prompts from "prompts";

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
  .command(
    "$0 [example]",
    "Starts a local development for the app in /src, or an example app if specified",
    (yargs) => {
      return yargs.positional("example", {
        describe: "The example app to run",
        type: "string",
        choices: Context.examples,
      });
    },
    (args) => {
      const ctx = new Context(process.env, args);
      appRunner.run(ctx);
    }
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
            title: example.replace(/_/g, " "),
            value: example,
          })),
          suggest: async (input, choices) =>
            choices.filter((choice) =>
              choice.title.toLowerCase().includes(input.toLowerCase())
            ),
        },
        {
          onCancel: () => {
            console.log(errorChalk("Aborted by the user."));
            process.exit(0);
          },
        }
      );

      if (example == null) {
        console.log(`${errorChalk("Error:")} No such example exists 😢`);
        process.exit(1);
      }

      const ctx = new Context(process.env, { ...args, example });
      appRunner.run(ctx);
    }
  )
  .parse();

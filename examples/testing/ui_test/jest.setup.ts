// For usage information, see the README.md file.

// Import Canva SDK testing utilities
import * as asset from "@canva/asset/test";
import * as design from "@canva/design/test";
import * as error from "@canva/error/test";
import * as intents from "@canva/intents/test";
import * as platform from "@canva/platform/test";
import * as user from "@canva/user/test";

/*
  Initialize test environments for each Canva SDK package
  This sets up the necessary test infrastructure before mocking the actual SDK methods
*/
asset.initTestEnvironment();
design.initTestEnvironment();
error.initTestEnvironment();
intents.initTestEnvironment();
platform.initTestEnvironment();
user.initTestEnvironment();

/*
  Mock all Canva SDK packages except @canva/error
  This allows tests to run without making real API calls to Canva's services
*/
jest.mock("@canva/asset");
jest.mock("@canva/design");
jest.mock("@canva/intents");
jest.mock("@canva/platform");
jest.mock("@canva/user");
/*
  Important: @canva/error should not be mocked
  Use it to simulate API error responses from other mocks by throwing CanvaError instances
  This allows testing of error handling scenarios
*/

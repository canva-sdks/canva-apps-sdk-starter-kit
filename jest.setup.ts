// Import testing sub-packages
import * as asset from "@canva/asset/test";
import * as design from "@canva/design/test";
import * as error from "@canva/error/test";
import * as platform from "@canva/platform/test";
import * as user from "@canva/user/test";

// Initialize the test environments
asset.initTestEnvironment();
design.initTestEnvironment();
error.initTestEnvironment();
platform.initTestEnvironment();
user.initTestEnvironment();

// Once they're initialized, mock the SDKs
jest.mock("@canva/asset");
jest.mock("@canva/design");
jest.mock("@canva/platform");
jest.mock("@canva/user");
// n.b. @canva/error should not be mocked - use it to simulate API error responses from other mocks by throwing CanvaError

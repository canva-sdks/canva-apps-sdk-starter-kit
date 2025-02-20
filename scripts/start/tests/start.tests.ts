/* eslint-disable no-console */

import type { ChildProcess } from "child_process";
import { spawn } from "child_process";
import * as treeKill from "tree-kill";

describe("start script", () => {
  let serverProcess: ChildProcess;

  afterEach(() => {
    if (serverProcess?.pid && !serverProcess.exitCode) {
      treeKill(serverProcess.pid);
    }
  });

  it("should execute 'npm run start' and start a dev server", async () => {
    const testServerPort = 8089;
    serverProcess = await spawn(
      `npm run start -- -p ${testServerPort} --no-preview`,
      {
        shell: true,
      },
    );

    if (!serverProcess.pid) {
      throw new Error("Unable to start server");
    }

    // wait for the server to start and collect output until it reports the running URL
    let output = "";
    await new Promise<void>((resolve, reject) => {
      serverProcess.stdout?.on("data", (data) => {
        output += data.toString();
        if (output.includes("Development URL")) {
          resolve();
        }
      });

      serverProcess.stderr?.on("data", (data) => {
        console.error("Server process error: ", data.toString());
        reject();
      });

      // timeout and fail test if the server hasn't correctly started in 10 seconds
      setTimeout(() => {
        if (serverProcess?.pid && !serverProcess.exitCode) {
          treeKill(serverProcess.pid);
        }
        reject(new Error("Test timed out"));
      }, 10000);
    });

    // check that the server is running and accessible
    const expectedServerURL = `http://localhost:${testServerPort}`;
    expect(output).toContain(expectedServerURL);
    expect(serverProcess.exitCode).toBeNull();

    // clean up
    treeKill(serverProcess.pid);
  }, 15000); // 15 seconds timeout to allow for the server to start
});

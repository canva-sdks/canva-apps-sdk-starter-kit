import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import treeKill from "tree-kill";

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
    let errorOutput = "";
    await new Promise<void>((resolve, reject) => {
      serverProcess.stdout?.on("data", (data) => {
        output += data.toString();
        if (output.includes("Development URL")) {
          resolve();
        }
      });

      // Collect stderr for diagnostics only. Tools in the process chain (e.g.
      // npm) can emit warnings to stderr while the server still starts
      // successfully, so stderr output alone must not fail the test.
      serverProcess.stderr?.on("data", (data) => {
        errorOutput += data.toString();
      });

      // A genuine startup failure surfaces as a non-zero exit.
      serverProcess.on("exit", (code) => {
        if (code != null && code !== 0) {
          reject(
            new Error(
              `Server process exited with code ${code}.\n${errorOutput}`,
            ),
          );
        }
      });

      // timeout and fail test if the server hasn't correctly started in 30 seconds
      setTimeout(() => {
        if (serverProcess?.pid && !serverProcess.exitCode) {
          treeKill(serverProcess.pid);
        }
        reject(new Error("Test timed out"));
      }, 30000);
    });

    // check that the server is running and accessible
    const expectedServerURL = `http://localhost:${testServerPort}`;
    expect(output).toContain(expectedServerURL);
    expect(serverProcess.exitCode).toBeNull();

    // clean up
    treeKill(serverProcess.pid);
  }, 35000); // 35 seconds timeout to allow for the server to start
});

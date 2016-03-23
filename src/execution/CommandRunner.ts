import * as path from "path";
import { ISaveCommand } from "../configuration/interfaces";
import * as Promise from "bluebird";
const { exec } = require("child_process");
const EXEC_TIMEOUT = 60 * 1000; // 1 minute
import getCommandArguments from "./getCommandArguments";
import resolveCommand from "./resolveCommand";
import {
  IExecutionResult,
  ICommandRunner
} from "./interfaces";

export default class CommandRunner implements ICommandRunner {
    public run(command: ISaveCommand, project: string, file: string) {
        const args = getCommandArguments(command.command, project, file);
        const resolved = resolveCommand(command.command, args);
        return this.executeShellCommand(resolved, { cwd: project, timeout: EXEC_TIMEOUT });
    }

    private executeShellCommand(command: string, options: Object) {
        return new Promise<IExecutionResult>((resolve, reject) => {
          exec(command, options, (err, stdout, stderr) => {
              if (err) {
                  console.log("Execution Error", err);
                  resolve({success: false, command, output: stderr, error: err});
              } else {
                  resolve({success: true, command, output: stdout});
              }
          });
        });
    }
}

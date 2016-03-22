import * as path from "path";
import { ISaveCommand, IConfiguration } from "./interfaces";
import CommandResolver from "./CommandResolver";
import * as Promise from "bluebird";
const { exec } = require("child_process");
const EXEC_TIMEOUT = 60 * 1000; // 1 minute

export interface IExecutionResult {
  success: boolean;
  command: string;
  output: string;
  error?: any;
}

export default class CommandRunner {
    constructor(private _commandResolver: CommandResolver) {
    }

    public run(command: ISaveCommand, config: IConfiguration, rootPath: string, filePath: string) {
        const args = this.getCommandArguments(command, rootPath, filePath);
        const resolved = this._commandResolver.resolve(command.command, args);
        return this.executeShellCommand(resolved, config, { cwd: rootPath, timeout: EXEC_TIMEOUT });
    }

    private getCommandArguments(command: ISaveCommand, project: string, filePath: string) {
      const ext = path.extname(filePath);
      const name = path.basename(filePath, ext);
      const dirRoot = command.base ? path.join(project, command.base) : project;
      const dir = path.relative(dirRoot, path.join(project, path.dirname(filePath)));
      const absPath = path.join(project, filePath);
      return {
          project, // Project root directory
          path_abs: absPath, // The absolute path of the changed file
          path: filePath, // The path of the changed file relative to the project
          ext, // The file extension
          name, // The filename without the extension
          dir: (dir === "" ? "." : dir), // The directory of the changed file relative to the command base or the project root
      };
    }

    private executeShellCommand(command: string, config: IConfiguration, options: Object) {
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

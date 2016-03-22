import * as path from "path";
import { ISaveCommand } from "./interfaces";
import CommandResolver from "./CommandResolver";
import CommandMatcher from "./CommandMatcher";

const atom = global['atom'];
const exec = require("child_process");
const EXEC_TIMEOUT = 60 * 1000; // 1 minute

export default class CommandRunner {
    constructor(
      private _commandResolver: CommandResolver,
      private _commandMatcher: CommandMatcher) {
    }

    public run(command: ISaveCommand, basePath: string, filePath: string) {
        if (this._commandMatcher.isApplicable(command, basePath, filePath)) {
            this.executeCommand(command, basePath, filePath);
        } else {
            console.log(`on-save: ${command.files} is not applicable to ${basePath}::${filePath}`);
        }
    }

    private executeCommand(command: ISaveCommand, basePath: string, filePath: string) {
        const fileExt = path.extname(filePath);
        const fileBase = path.basename(filePath, fileExt);
        const fileDir = path.dirname(filePath);
        const commandArguments = {
            basePath,
            filePath,
            fileExt,
            fileBase,
            fileDir
        };
        const resolved = this._commandResolver.resolve(command.command, commandArguments);
        this.executeShellCommand(resolved, { cwd: basePath, timeout: EXEC_TIMEOUT });
    }

    private executeShellCommand(command: string, options: Object) {
        console.log(`on-save: executing ${command}`);
        exec(command, options, (err, stdout, stderr) => {
            if (!err) {
                if (stdout) {
                    console.log(stdout.trim());
                }
            } else {
                const message = `on-save: An error occurred while running the command: ${command}`;
                atom.notifications.addError(message, { detail: stderr, dismissable: true });
            }
        });
    }
}

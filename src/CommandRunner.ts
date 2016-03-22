import * as path from "path";
import { ISaveCommand, IConfiguration } from "./interfaces";
import CommandResolver from "./CommandResolver";
import CommandMatcher from "./CommandMatcher";
const PlainMessageView = require('atom-message-panel').PlainMessageView;
const atom = global['atom'];
const { exec } = require("child_process");
const EXEC_TIMEOUT = 60 * 1000; // 1 minute

export default class CommandRunner {
    constructor(
        private _commandResolver: CommandResolver,
        private _commandMatcher: CommandMatcher,
        private _messagePanel: any) {
    }

    public run(command: ISaveCommand, config: IConfiguration, basePath: string, filePath: string) {
        if (this._commandMatcher.isApplicable(command, basePath, filePath)) {
            this.executeCommand(command, config, basePath, filePath);
        }
    }

    private executeCommand(command: ISaveCommand, config: IConfiguration, rootPath: string, filePath: string) {
        const fileExt = path.extname(filePath);
        const fileBase = path.basename(filePath, fileExt);
        const fileDir = path.dirname(filePath);
        const relativeRoot = command.basePath ? path.join(rootPath, command.basePath) : rootPath;
        const fileDirRelativeToBase = path.relative(relativeRoot, path.join(rootPath, fileDir));
        const commandArguments = {
            filePath,
            rootPath,
            fileExt,
            fileBase,
            fileDir,
            fileDirRelativeToBase
        };
        const resolved = this._commandResolver.resolve(command.command, commandArguments);
        this.executeShellCommand(resolved, config, { cwd: rootPath, timeout: EXEC_TIMEOUT });
    }

    private executeShellCommand(command: string, config: IConfiguration, options: Object) {
        exec(command, options, (err, stdout, stderr) => {
            if (err) {
                this.showError(command, stderr);
            } else if (config.showSuccess) {
                this.showSuccess(command, stdout);
                if (config.autohideSuccess) {
                    this.autohide(config.autohideSuccessTimeout);
                }
            } else {
                this._messagePanel.clear();
                this._messagePanel.close();
            }
        });
    }

    private autohide(timeout: number) {
        setTimeout(() => this._messagePanel.close(), timeout);
    }

    private showSuccess(command: string, output: string) {
        this._messagePanel.clear();
        this._messagePanel.attach();
        this._messagePanel.add(new PlainMessageView({
            className: "text-success",
            message: "Success: " + command + (output ? " => " + output : "")
        }));
    }

    private showError(command: string, output: string) {
        this._messagePanel.clear();
        this._messagePanel.attach();
        this._messagePanel.add(new PlainMessageView({
            className: "text-error",
            message: "Failure: " + command + " => " + output
        }));
    }
}

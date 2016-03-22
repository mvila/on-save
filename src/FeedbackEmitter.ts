import { IConfiguration } from "./interfaces";
import { IExecutionResult } from "./CommandRunner";
const PlainMessageView = require('atom-message-panel').PlainMessageView;

export default class FeedbackEmitter {
    private _statusBar: StatusBar.IStatusBarView;
    constructor(private _messagePanel: any) {
    }

    public set statusBar(sb: StatusBar.IStatusBarView) {
      this._statusBar = sb;
    }

    public onResult(result: IExecutionResult, config: IConfiguration) {
      if (result.success) {
        this.emitSuccessFeedback(result, config);
      } else {
        this.emitFailureFeedback(result, config);
      }
    }

    private emitSuccessFeedback(result: IExecutionResult, config: IConfiguration) {
      if (config.showSuccess) {
          this.showSuccess(result.command, result.output);
          if (config.autohideSuccess) {
              this.autohide(config.autohideSuccessTimeout);
          }
      } else {
          this._messagePanel.clear();
          this._messagePanel.close();
      }
    }

    private showSuccess(command: string, output: string) {
        this._messagePanel.clear();
        this._messagePanel.attach();
        this._messagePanel.add(new PlainMessageView({
            className: "text-success",
            message: "Success: " + command + (output ? " => " + output : "")
        }));
    }

    private autohide(timeout: number) {
        setTimeout(() => this._messagePanel.close(), timeout);
    }

    private emitFailureFeedback(result: IExecutionResult, config: IConfiguration) {
      const { command, output } = result;
      this._messagePanel.clear();
      this._messagePanel.attach();
      this._messagePanel.add(new PlainMessageView({
          className: "text-error",
          message: "Failure: " + command + " => " + output
      }));
    }
}

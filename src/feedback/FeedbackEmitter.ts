import * as path from "path";
import { IPluginConfiguration } from "../configuration/interfaces";
import { IExecutionResult } from "../execution/interfaces";
import { IFeedbackEmitter, ISimpleResultHandler } from "./interfaces";
import { IActiveItemListener } from "../interfaces";
const PlainMessageView = require("atom-message-panel").PlainMessageView;

export default class FeedbackEmitter implements IFeedbackEmitter {
    constructor(
      private _messagePanel: any,
      private _handlers: ISimpleResultHandler[] = [],
      private _activeItemListener: IActiveItemListener
    ) {
      _activeItemListener.subscribe(this.onActiveItemChanged.bind(this));
    }

    public show() {
        this._messagePanel.attach();
    }

    public clear() {
        this._messagePanel.clear();
    }

    public onResult(result: IExecutionResult, config: IPluginConfiguration, project: string, file: string) {
        let absPath = path.join(project, file);
        if (result.success) {
            this.emitSuccessFeedback(result, config);
            this._handlers.forEach(h => h.onSuccess(absPath));
        } else {
            this.emitFailureFeedback(result);
            this._handlers.forEach(h => h.onFailure(absPath));
        }
    }

    private onActiveItemChanged(file) {
        this.clear();
    }

    private emitSuccessFeedback(result: IExecutionResult, config: IPluginConfiguration) {
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
        this._messagePanel.attach();
        this._messagePanel.clear();
        this._messagePanel.add(new PlainMessageView({
            className: "text-success",
            message: "Success: " + command + (output ? " => " + output : "")
        }));
    }

    private autohide(timeout: number) {
        setTimeout(() => this._messagePanel.close(), timeout);
    }

    private emitFailureFeedback(result: IExecutionResult) {
        const { command, output } = result;
        this._messagePanel.clear();
        this._messagePanel.attach();
        this._messagePanel.add(new PlainMessageView({
            className: "text-error",
            message: "Failure: " + command + " => " + output
        }));
    }
}

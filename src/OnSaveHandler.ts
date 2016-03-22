import * as fs from 'fs';
import * as path from 'path';
import { ISaveCommand } from "./interfaces";
import ConfigurationReader from "./ConfigurationReader";
import CommandMatcher from "./CommandMatcher";
import CommandRunner from "./CommandRunner";
import FeedbackEmitter from "./FeedbackEmitter";

// TODO: Use TS Imports when Atom Typings are complete
const { CompositeDisposable } = require("atom");

export default class OnSaveHandler {
    private subscriptions: any;
    private _statusBar: StatusBar.IStatusBarView;

    constructor(
        private _configurationReader: ConfigurationReader,
        private _commandMatcher: CommandMatcher,
        private _commandRunner: CommandRunner,
        private _feedbackEmitter: FeedbackEmitter) {
    }

    public consumeStatusBar(sb: StatusBar.IStatusBarView) {
      this._feedbackEmitter.statusBar = sb;
    }

    public activate() {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
            this.subscriptions.add(textEditor.onDidSave(this.handleDidSave.bind(this)));
        }));
    }

    public deactivate() {
        this.subscriptions.dispose();
    }

    private handleDidSave(event) {
        const eventPath = event.path;
        const projectPath = this.getProjectPath(eventPath);
        if (projectPath) {
            const savedFilePath = path.relative(projectPath, eventPath);
            const config = this._configurationReader.readConfiguration(projectPath);
            config.commands.forEach(command => {
              const isApplicable = this._commandMatcher.isApplicable(command, projectPath, savedFilePath);
              if (isApplicable) {
                this._commandRunner.run(command, config.config, projectPath, savedFilePath)
                .then(result => this._feedbackEmitter.onResult(result, config.config));
              }
            });
        }
    }

    private getProjectPath(eventPath): string {
        const dir = atom.project.rootDirectories['find'](dir => dir.contains(eventPath));
        return dir ? dir.path : null;
    }
}

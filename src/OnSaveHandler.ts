import * as fs from 'fs';
import * as path from 'path';
import { ISaveCommand } from "./interfaces";
import ConfigurationReader from "./ConfigurationReader";
import CommandMatcher from "./CommandMatcher";
import CommandRunner from "./CommandRunner";
// TODO: Use TS Imports when Atom Typings are complete
const { CompositeDisposable } = require("atom");

export default class OnSaveHandler {
    private subscriptions: any;

    constructor(
        private _configurationReader: ConfigurationReader,
        private _commandMatcher: CommandMatcher,
        private _commandRunner: CommandRunner) {
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
              if (this._commandMatcher.isApplicable(command, projectPath, savedFilePath)) {
                this._commandRunner.run(command, config.config, projectPath, savedFilePath);
              }
            });
        }
    }

    private getProjectPath(eventPath): string {
        const dir = atom.project.rootDirectories['find'](dir => dir.contains(eventPath));
        return dir ? dir.path : null;
    }
}

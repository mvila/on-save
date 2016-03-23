import * as fs from "fs";
import * as path from "path";
import {
    ISaveCommand,
    IConfiguration,
    IPluginConfiguration,
    IConfigurationReader
} from "./configuration/interfaces";
import { ICommandRunner } from "./execution/interfaces";
import { IFeedbackEmitter } from "./feedback/interfaces";

// TODO: Use TS Imports when Atom Typings are complete
const { CompositeDisposable } = require("atom");

const CONFIGS_FILENAME = ".on-save.json";

export default class OnSaveHandler {
    private subscriptions: any;
    private _statusBar: StatusBar.IStatusBarView;

    constructor(
        private _configurationReader: IConfigurationReader,
        private _commandRunner: ICommandRunner,
        private _feedbackEmitter: IFeedbackEmitter,
        private _indicatorTile: any) {
    }

    public consumeStatusBar(sb: StatusBar.IStatusBarView) {
        // sb['addRightTile']({item: this._indicatorTile, priority: 0});
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
        const project = this.getProjectPath(eventPath);
        if (project) {
            const file = path.relative(project, eventPath);
            const config = this.readConfiguration(project);
            const commands = config.getCommandsApplicableToFile(file);
            commands.forEach(command => this.execute(command, config.config, project, file))
        }
    }

    private execute(command: ISaveCommand, config: IPluginConfiguration, project: string, file: string) {
        return this._commandRunner.run(command, project, file)
            .then(result => this._feedbackEmitter.onResult(result, config, project, file));
    }

    private readConfiguration(projectPath: string): IConfiguration {
        const filePath = path.join(projectPath, CONFIGS_FILENAME);
        return this._configurationReader.readConfiguration(filePath);
    }

    private getProjectPath(eventPath): string {
        const dir = atom.project.rootDirectories["find"](rootDir => rootDir.contains(eventPath));
        return dir ? dir.path : null;
    }
}

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
import {
  IInitializable,
  IDisposable
} from "./interfaces";
// TODO: Use TS Imports when Atom Typings are complete
const { CompositeDisposable } = require("atom");

const CONFIGS_FILENAME = ".on-save.json";

export default class OnSaveHandler {
    private _subscriptions: any;
    private _statusBar: StatusBar.IStatusBarView;

    constructor(
        private _initializables: IInitializable[],
        private _disposables: IDisposable[],
        private _configurationReader: IConfigurationReader,
        private _commandRunner: ICommandRunner,
        private _feedbackEmitter: IFeedbackEmitter,
        private _indicatorTile: any) {        
    }

    public consumeStatusBar(statusBar) {
        this._initializables.forEach(i => i.initialize());
        this._indicatorTile.registerOnClickHandler(() => this._feedbackEmitter.show());
        statusBar.addRightTile({item: this._indicatorTile, priority: 0});
    }

    public activate() {
        this._subscriptions = new CompositeDisposable();
        this._subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
            this._subscriptions.add(textEditor.onDidSave(this.handleDidSave.bind(this)));
        }));
        this._disposables.push(this._subscriptions);
    }

    public deactivate() {
        this._disposables.forEach(d => d.dispose());
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

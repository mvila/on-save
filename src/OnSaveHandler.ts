import * as fs from 'fs';
import * as path from 'path';
import { ISaveCommand, ICompositeDisposable } from "./interfaces";
import ConfigurationReader from "./ConfigurationReader";
import CommandRunner from "./CommandRunner";

// TODO: Use TS Imports when Atom Typings are completeq
const { CompositeDisposable } = require("atom");

export default class OnSaveModule {
  private subscriptions: ICompositeDisposable;

  constructor(
    private _configurationReader: ConfigurationReader,
    private _commandRunner: CommandRunner) {
  }

  public activate() {
    this.subscriptions = <ICompositeDisposable>(new CompositeDisposable());
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
    if (!projectPath) {
      console.error('on-save: Unable to find the project path');
      return;
    }

    const savedFilePath = path.relative(projectPath, eventPath);
    const commands = this._configurationReader.readConfiguration(projectPath);
    commands.forEach(command => this._commandRunner.run(command, projectPath, savedFilePath));
  }

  private getProjectPath(eventPath) {
    return atom.project['directories'].find(dir => dir.contains(eventPath));
  }
}

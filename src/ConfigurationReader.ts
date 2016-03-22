import * as path from "path";
import * as fs from "fs";
import { ISaveCommand } from "./interfaces";
const log = require("debug")("on-save:ConfigurationReader");
const CONFIGS_FILENAME = '.on-save.json';

export default class ConfigurationReader {

  public readConfiguration(projectPath: string): ISaveCommand[] {
    const filePath = path.join(projectPath, CONFIGS_FILENAME);
    const isConfigPresent = fs.existsSync(filePath);
    return isConfigPresent ? this.readCommandsFromFile(filePath) : [];
  }

  private readCommandsFromFile(filePath: string) {
    return this.readFileContents(filePath).map(({files, command}) => {
      if (!files) throw new Error('on-save: \'files\' property is missing in \'.on-save.json\' configuration file');
      if (!command) throw new Error('on-save: \'command\' property is missing in \'.on-save.json\' configuration file');
      return { files, command };
    });
  }

  private readFileContents(filePath: string) {
    try {
      const contents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(contents) || [];
    } catch (err) {
      log("Error Reading Configuration", err);
      throw err;
    }
  }
}

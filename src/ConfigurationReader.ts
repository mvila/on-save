import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

import { IConfigFile, IConfiguration } from "./interfaces";
const log = require("debug")("savey-wavey::ConfigurationReader");
const CONFIGS_FILENAME = '.on-save.json';

const DEFAULT_CONFIG = {
  showSuccess: true,
  autohideSuccess: true,
  autohideSuccessTimeout: 1200
};
const EMPTY_CONFIG_FILE = { commands: [], config: DEFAULT_CONFIG };

export default class ConfigurationReader {

  public readConfiguration(projectPath: string): IConfigFile {
    const filePath = path.join(projectPath, CONFIGS_FILENAME);
    const isConfigPresent = fs.existsSync(filePath);
    return isConfigPresent ? _.merge(EMPTY_CONFIG_FILE, this.readCommandsFromFile(filePath)) : EMPTY_CONFIG_FILE;
  }

  private readCommandsFromFile(filePath: string): IConfigFile {
    const configuration = this.readFileContents(filePath);
    configuration.commands.map(({files, command, baseDir}) => {
      if (!files) throw new Error('savey-wavey:: \'files\' property is missing in \'.savey-wavey:.json\' configuration file');
      if (!command) throw new Error('savey-wavey:: \'command\' property is missing in \'.savey-wavey:.json\' configuration file');
      return { files, command, baseDir };
    });
    return configuration;
  }

  private readFileContents(filePath: string): IConfigFile {
    try {
      const contents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(contents);
    } catch (err) {
      console.error("savey-wavey: error reading configuration", err);
      throw err;
    }
  }
}

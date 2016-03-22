import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

import { IConfigFile, IConfiguration } from "./interfaces";
const log = require("debug")("savey-wavey::ConfigurationReader");
const CONFIGS_FILENAME = ".on-save.json";

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
    configuration.commands.map(({watch, command, base}) => {
      if (!watch) {
        throw new Error("savey-wavey:: 'watch' property is missing in configuration file");
      }
      if (!command) {
        throw new Error("savey-wavey:: 'command' property is missing in configuration file");
      }
      return { watch, command, base };
    });
    return configuration;
  }

  private readFileContents(filePath: string): IConfigFile {
    try {
      const contents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(contents);
    } catch (err) {
      console.error("savey-wavey: error reading configuration", err);
      throw err;
    }
  }
}

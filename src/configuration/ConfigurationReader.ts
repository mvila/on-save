import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";
import SaveCommand from "./SaveCommand";
import Configuration from "./Configuration";

import { IPluginConfiguration, IConfiguration } from "./interfaces";

export const EMPTY_CONFIG = { commands: [], config: {}};

export default class ConfigurationReader {

  public readConfiguration(configFile: string): IConfiguration {
    const isConfigPresent = fs.existsSync(configFile);
    const confData = isConfigPresent ?
      _.merge(EMPTY_CONFIG, this.readCommandsFromFile(configFile)) :
      EMPTY_CONFIG;
    return new Configuration(
      confData.commands || [],
      confData.config as IPluginConfiguration);
  }

  private readCommandsFromFile(filePath: string): IConfiguration {
    const configuration = this.readFileContents(filePath);
    configuration.commands = configuration.commands.map(({watch, command, base}) => new SaveCommand(watch, command, base));
    return configuration;
  }

  private readFileContents(filePath: string): IConfiguration {
    try {
      const contents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(contents);
    } catch (err) {
      console.error("savey-wavey: error reading configuration file", err);
      throw new Error("Savey-Wavey: Error Reading Configuration File");
    }
  }
}

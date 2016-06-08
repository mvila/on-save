import * as _ from "lodash";
import {
  IConfiguration,
  ISaveCommand,
  IPluginConfiguration
} from "./interfaces";

const DEFAULT_CONFIG: IPluginConfiguration = {
  showSuccess: true,
  autohideSuccess: true,
  autohideSuccessTimeout: 1200
};

export default class Configuration implements IConfiguration {
  public config: IPluginConfiguration;

  constructor(public commands: ISaveCommand[] = [], config: IPluginConfiguration = DEFAULT_CONFIG) {
      this.config = _.merge(DEFAULT_CONFIG, config);
  }

  public getCommandsApplicableToFile(file: string) {
    return this.commands.filter(c => c.appliesTo(file));
  }
}

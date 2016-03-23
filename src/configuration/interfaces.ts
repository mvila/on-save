/**
 * Represents a single save command in the on-save configuration.
 */
export interface ISaveCommand {
  /**
   * The glob containing the files to watch.
   */
  watch: string;

  /**
   * The file basepath
   */
  base: string;

  /**
   * The command to execute when files change.
   */
  command: string;

  /**
   * Determines whether this save command applies to a file
   */
  appliesTo(file: string): boolean;
}

export interface IPluginConfiguration {
  showSuccess: boolean;
  autohideSuccess: boolean;
  autohideSuccessTimeout: number;
}

export interface IConfiguration {
  commands: ISaveCommand[];
  config: IPluginConfiguration;

  getCommandsApplicableToFile(file: string): ISaveCommand[];
}

export interface IConfigurationReader {
  readConfiguration(file: string): IConfiguration;
}

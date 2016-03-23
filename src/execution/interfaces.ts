import { ISaveCommand } from "../configuration/interfaces";

export interface ICommandRunner {
  run(command: ISaveCommand, project: string, file: string);
}

export interface IExecutionResult {
  success: boolean;
  command: string;
  output: string;
  error?: any;
}

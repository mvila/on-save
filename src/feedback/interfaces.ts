import { IExecutionResult } from "../execution/interfaces";
import { IPluginConfiguration } from "../configuration/interfaces";

export interface IFeedbackEmitter {
  onResult(result: IExecutionResult, config: IPluginConfiguration, project: string, file: string);
}

export interface ISimpleResultHandler {
  onSuccess(file: string);
  onFailure(file: string);
}

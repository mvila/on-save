import { IExecutionResult } from "../execution/interfaces";
import { IPluginConfiguration } from "../configuration/interfaces";

export interface IFeedbackEmitter {
  onResult(result: IExecutionResult, config: IPluginConfiguration);
}

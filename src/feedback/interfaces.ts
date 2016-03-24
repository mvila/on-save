import { IExecutionResult } from "../execution/interfaces";
import { IPluginConfiguration } from "../configuration/interfaces";

export interface IFeedbackEmitter {
  onResult(result: IExecutionResult, config: IPluginConfiguration, project: string, file: string);

  //
  // Toggles the Feedback Pane View
  //
  show();
}

export interface ISimpleResultHandler {
  onSuccess(file: string);
  onFailure(file: string);
}

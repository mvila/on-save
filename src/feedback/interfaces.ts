import { IExecutionResult } from "../execution/interfaces";
import { IPluginConfiguration } from "../configuration/interfaces";

export interface IFeedbackEmitter {
  /**
   * Handles an Execution Result
   */
  onResult(result: IExecutionResult, config: IPluginConfiguration, project: string, file: string);

  /**
   * Toggles the Feedback Pane View
   */
  show();

  /**
   * Clears the Feedback View
   */
  clear();
}

export interface ISimpleResultHandler {
  onSuccess(file: string);
  onFailure(file: string);
}

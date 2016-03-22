import OnSaveHandler from "./OnSaveHandler";
import ConfigurationReader from "./ConfigurationReader";
import CommandRunner from "./CommandRunner";
import CommandResolver from "./CommandResolver";
import CommandMatcher from "./CommandMatcher";

const onSaveModule = new OnSaveHandler(
  new ConfigurationReader(),
  new CommandRunner(
    new CommandResolver(),
    new CommandMatcher()
  )
);
export default onSaveModule;

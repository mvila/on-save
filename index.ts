import OnSaveHandler from "./src/OnSaveHandler";
import ConfigurationReader from "./src/ConfigurationReader";
import CommandRunner from "./src/CommandRunner";
import CommandResolver from "./src/CommandResolver";
import CommandMatcher from "./src/CommandMatcher";
const MessagePanelView = require('atom-message-panel').MessagePanelView;

const onSaveModule = new OnSaveHandler(
  new ConfigurationReader(),
  new CommandMatcher(),
  new CommandRunner(
    new CommandResolver(),
    new MessagePanelView({ title: "Save Scripts", recentMessagesAtTop: true, maxHeight: 100 })
  )
);
module.exports = onSaveModule;

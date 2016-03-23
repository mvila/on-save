import OnSaveHandler from "./src/OnSaveHandler";
import ConfigurationReader from "./src/configuration/ConfigurationReader";
import CommandRunner from "./src/execution/CommandRunner";
import FeedbackEmitter from "./src/feedback/FeedbackEmitter";
const MessagePanelView = require('atom-message-panel').MessagePanelView;

const onSaveModule = new OnSaveHandler(
  new ConfigurationReader(),
  new CommandRunner(),
  new FeedbackEmitter(new MessagePanelView({ title: "Save Scripts", recentMessagesAtTop: true, maxHeight: 100 }))
);
module.exports = onSaveModule;

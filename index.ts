import OnSaveHandler from "./src/OnSaveHandler";
import ConfigurationReader from "./src/configuration/ConfigurationReader";
import CommandRunner from "./src/execution/CommandRunner";
import FeedbackEmitter from "./src/feedback/FeedbackEmitter";
import SaveStatusIndicator from "./src/feedback/SaveStatusIndicator";
const MessagePanelView = require('atom-message-panel').MessagePanelView;

const messagePanel = new MessagePanelView({ title: "Save Scripts", recentMessagesAtTop: true, maxHeight: 100 });
const saveStatusIndicator = new SaveStatusIndicator();

const onSaveModule = new OnSaveHandler(
  new ConfigurationReader(),
  new CommandRunner(),
  new FeedbackEmitter(messagePanel, [saveStatusIndicator]),
  saveStatusIndicator
);
module.exports = onSaveModule;

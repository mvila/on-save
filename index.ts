import OnSaveHandler from "./src/OnSaveHandler";
import ActiveItemListener from "./src/ActiveItemListener";
import ConfigurationReader from "./src/configuration/ConfigurationReader";
import CommandRunner from "./src/execution/CommandRunner";
import FeedbackEmitter from "./src/feedback/FeedbackEmitter";
import SaveStatusIndicator from "./src/feedback/SaveStatusIndicator";
const MessagePanelView = require('atom-message-panel').MessagePanelView;

const messagePanel = new MessagePanelView({
  title: "Save Scripts",
  recentMessagesAtTop: true,
  maxHeight: 100
});
const saveStatusIndicator = new SaveStatusIndicator();
const activeItemListener = new ActiveItemListener();
saveStatusIndicator.activeItemListener = activeItemListener;

const onSaveModule = new OnSaveHandler(
  [ activeItemListener, saveStatusIndicator ],
  [ activeItemListener, saveStatusIndicator ],
  new ConfigurationReader(),
  new CommandRunner(),
  new FeedbackEmitter(messagePanel, [saveStatusIndicator], activeItemListener),
  saveStatusIndicator
);
module.exports = onSaveModule;

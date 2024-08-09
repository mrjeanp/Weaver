import msg from "./commands/msg";
import react from "./commands/react";
import unchannel from "./commands/unchannel";
import {
  reactionAddListener,
  reactionRemoveListener,
} from "./handlers/reactions";
// import { voiceListener } from "./handlers/voice";
import { Bot } from "./lib/Bot";

import ping from "./commands/ping";
import role from "./commands/role";
import readyListener from "./handlers/readyListener";
import play from "./commands/play";

new Bot()
  .addListeners([
    readyListener,
    reactionAddListener,
    reactionRemoveListener,
  ])
  .addCommands([msg, ping, react, unchannel, role, play])
  .start();

import { MsgCommand } from "./commands/msg";
import PingCommand from "./commands/ping";
import { ReactCommand } from "./commands/react";
import RoleCommand from "./commands/role";
import { UnchannelCommand } from "./commands/unchannel";
import {
  reactionAddListener,
  reactionRemoveListener,
} from "./handlers/reactions";
import { voiceListener } from "./handlers/voice";
import { Bot } from "./lib/Bot";

import interactionCreateListener from "./lib/core/interactionCreateListener";
import readyListener from "./lib/core/readyListener";

const bot = new Bot()
  .addListeners([
    readyListener,
    interactionCreateListener,
    reactionAddListener,
    reactionRemoveListener,
    voiceListener,
  ])
  .addCommands([
    new PingCommand(),
    new ReactCommand(),
    new UnchannelCommand(),
    new MsgCommand(),
    new RoleCommand(),
  ])
  .start();

import { expect, test } from "bun:test";
import { Bot } from "../bot";
import msg from "../bot/commands/msg";
import ping from "../bot/commands/ping";
import react from "../bot/commands/react";
import role from "../bot/commands/role";
import unchannel from "../bot/commands/unchannel";
import {
  reactionAddListener,
  reactionRemoveListener,
} from "../bot/handlers/reactions";
import readyListener from "../bot/handlers/readyListener";
import { voiceListener } from "../bot/handlers/voice";

test("Bot does not crash on start", async () => {
  expect(() => {
    const bot = new Bot()
      .addListeners([
        readyListener,
        reactionAddListener,
        reactionRemoveListener,
        voiceListener,
      ])
      .addCommands([msg, ping, react, unchannel, role])
      .start();
  }).not.toThrow();
});

import { expect, test } from "bun:test";
import { Bot } from "../bot";
import PingCommand from "../bot/commands/ping";
import readyListener from "../bot/lib/core/readyListener";

test("Bot does not crash on start", async () => {
  expect(() => {
    const bot = new Bot()
      .addCommands([new PingCommand()])
      .addListeners([readyListener])
      .start();
  }).not.toThrow();
});

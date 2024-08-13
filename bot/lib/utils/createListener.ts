import type { ClientEvents } from "discord.js";
import type BotListener from "../interfaces/BotListener";
import type { Bot } from "../Bot";

export default function createListener<Event extends keyof ClientEvents = any>(
  event: Event,
  callback: (bot: Bot, ...args: ClientEvents[Event]) => void | Promise<void>
): BotListener {
  return {
    event,
    callback,
  };
}

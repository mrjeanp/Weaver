import type { ClientEvents } from "discord.js";
import type { Bot } from "../Bot";

export default interface BotListener<Event extends keyof ClientEvents = any> {
  event: Event;
  callback: (bot: Bot, ...args: ClientEvents[Event]) => void | Promise<void>;
}

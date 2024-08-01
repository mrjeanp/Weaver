import type { ClientEvents } from "discord.js";

class BotListener<Event extends keyof ClientEvents = any> {
  event: Event;
  callback: (...args: ClientEvents[Event]) => void;

  constructor(event: Event, callback: (...args: ClientEvents[Event]) => void) {
    this.event = event;
    this.callback = callback;
  }
}

export { BotListener };
export default BotListener;

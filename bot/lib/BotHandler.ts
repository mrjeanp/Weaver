import type { Client, ClientEvents, Events } from "discord.js";
import { default as defaultClient } from "./client";
import type { ClientEventRegister } from "./interfaces";

export default class BotHandler implements ClientEventRegister {
  client: Client;

  /**
   * An array of listeners created by this object
   */
  protected ons: {
    event: keyof ClientEvents;
    listener: (...args: ClientEvents[keyof ClientEvents]) => void;
  }[] = [];

  constructor(client?: Client) {
    this.client = client ?? defaultClient;
  }

  /**
   * Creates an event listener but doesn't start listening to it until
   * `this.register()` is called
   */
  listen<Event extends keyof ClientEvents>(
    event: Event,
    listener: (...args: ClientEvents[Event]) => void
  ) {
    this.ons.push({
      event,
      listener: listener as (...args: ClientEvents[keyof ClientEvents]) => void,
    });
    return this;
  }

  /**
   * Start listening to all events created by this object
   */
  register() {
    for (const { event, listener } of this.ons) {
      this.client.on(event, listener);
    }
  }

  /**
   * Stops listening to all events created by this object and
   * empties the list of listeners
   */
  unregister() {
    for (const { event, listener } of this.ons) {
      this.client.off(event, listener);
    }
  }
}

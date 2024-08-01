import {
  ChatInputCommandInteraction,
  REST,
  Routes,
  type Client,
  type ClientEvents,
  type Interaction,
} from "discord.js";
import { BotCommand } from "./BotCommand";
import { client as defaultClient } from "./client";
import interactionCreateListener from "./core/interactionCreateListener";

type BotConfig = {
  token: string;
  applicationId: string;
  guildId?: string;
  client: Client;
  rest: REST;
};

export const defaulBotConfig: BotConfig = {
  token: process.env.DISCORD_TOKEN ?? "",
  applicationId: process.env.DISCORD_APPLICATION_ID ?? "",
  guildId: process.env.GUILD_ID,
  client: defaultClient,
  rest: new REST(),
};

export class Bot {
  readonly client: Client<boolean>;
  protected config: BotConfig;

  //
  protected listeners: BotListener[] = [];
  protected commands: BotCommand[] = [];
  protected rest: REST;

  static instance: Bot;

  constructor(config = defaulBotConfig) {
    this.config = config;
    this.client = config.client;
    this.rest = config.rest.setToken(this.config.token);

    Bot.instance = this;
  }

  async start() {
    // for handling commands
    this.addListeners([interactionCreateListener]);

    this.listen();
    await this.pushCommands();
    await this.client.login(this.config.token);
  }

  async pushCommands() {
    const guildId = this.config.guildId;
    const rest = this.rest;
    const clientId = this.config.applicationId;
    let data = [];
    const body = this.commands.map((c) => c.getData());

    try {
      if (guildId) {
        data = (await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body }
        )) as any[];
      } else {
        data = (await rest.put(Routes.applicationCommands(clientId), {
          body,
        })) as any[];
      }
    } catch (err) {
      console.error(err);
    } finally {
      console.log(`Deployed ${data?.length} application (/) commands.`);
    }
  }

  async handleCommandInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const command = this.commands.find(
      (c) => c.builder.name === interaction.commandName
    );
    command?.handle(interaction as ChatInputCommandInteraction);
  }

  addCommand(command: BotCommand) {
    this.commands.push(command);
    return this;
  }

  addCommands(commands: BotCommand[]) {
    for (const command of commands) {
      this.addCommand(command);
    }
    return this;
  }

  ///
  addListener(botListener: BotListener) {
    this.listeners.push(botListener);

    return this;
  }

  //
  addListeners(botListeners: BotListener[]) {
    for (const listener of botListeners) {
      this.addListener(listener);
    }
    return this;
  }

  unlisten() {
    for (const listener of this.listeners) {
      this.client.off(listener.event, listener.callback);
    }
    return this;
  }

  listen() {
    for (const listener of this.listeners) {
      this.client.on(listener.event, listener.callback);
    }
  }

  //
  removeListener(listener: BotListener) {
    this.client.off(listener.event, listener.callback);
    this.listeners = this.listeners.filter((l) => l !== listener);
    return this;
  }

  getLastListener() {
    return this.listeners.at(this.listeners.length - 1);
  }
}
class BotListener<Event extends keyof ClientEvents = any> {
  event: Event;
  callback: (...args: ClientEvents[Event]) => void;

  constructor(event: Event, callback: (...args: ClientEvents[Event]) => void) {
    this.event = event;
    this.callback = callback;
  }
}
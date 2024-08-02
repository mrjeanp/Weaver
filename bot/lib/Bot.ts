import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  type Client,
  type ClientEvents,
  type Interaction,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import defaultClient from "./defaultClient";
import GuildConfig from "./GuildConfig";
import interactionCreateListener from "./interactionCreateListener";

export type BotSettings = {
  token: string;
  applicationId: string;
  guildId?: string;
  client: Client;
  rest: REST;
};

export const defaultSettings: BotSettings = {
  token: process.env.DISCORD_TOKEN ?? "",
  applicationId: process.env.DISCORD_APPLICATION_ID ?? "",
  guildId: process.env.GUILD_ID,
  client: defaultClient,
  rest: new REST(),
};

export class Bot {
  readonly client: Client<boolean>;
  protected settings: BotSettings;

  //
  protected listeners: BotListener[] = [];
  protected commands: BotCommand[] = [];
  protected rest: REST;

  static instance: Bot;

  constructor(settings = defaultSettings) {
    this.settings = settings;
    this.client = settings.client;
    this.rest = settings.rest.setToken(this.settings.token);

    Bot.instance = this;
  }

  config(guildId: string) {
    return new GuildConfig(this, guildId);
  }

  async start() {
    // for handling commands
    this.addListeners([interactionCreateListener]);

    this.listen();
    await this.pushCommands();
    await this.client.login(this.settings.token);
  }

  async pushCommands() {
    const guildId = this.settings.guildId;
    const rest = this.rest;
    const clientId = this.settings.applicationId;
    let data = [];

    const body = this.commands.map((c) =>
      c.builder(new SlashCommandBuilder(), this).toJSON()
    );

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

  /**
   *
   * @param interaction
   * @returns
   */
  async handleCommandInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

    const command = this.commands.find(
      (c) =>
        c.builder(new SlashCommandBuilder(), this).name ===
        interaction.commandName
    );
    command?.handler(interaction, this);
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
      this.client.on(listener.event, (...args: any[]) =>
        listener.callback(this, ...args)
      );
    }
  }

  removeListener(listener: BotListener) {
    this.client.off(listener.event, listener.callback);
    this.listeners = this.listeners.filter((l) => l !== listener);
    return this;
  }

  getLastListener() {
    return this.listeners.at(this.listeners.length - 1);
  }
}

export interface BotCommand {
  builder: (
    builder: SlashCommandBuilder,
    bot: Bot
  ) =>
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  handler: (
    interaction: ChatInputCommandInteraction,
    bot: Bot
  ) => void | Promise<void>;
}

export interface BotListener<Event extends keyof ClientEvents = any> {
  event: Event;
  callback: (bot: Bot, ...args: ClientEvents[Event]) => void | Promise<void>;
}

export function createCommand(
  builder: BotCommand["builder"],
  handler: BotCommand["handler"]
) {
  return {
    builder,
    handler,
  };
}

export function createListener<Event extends keyof ClientEvents = any>(
  event: Event,
  callback: (bot: Bot, ...args: ClientEvents[Event]) => void | Promise<void>
): BotListener {
  return {
    event,
    callback,
  };
}

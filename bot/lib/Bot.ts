import {
  ApplicationCommandType,
  REST,
  Routes,
  SlashCommandBuilder,
  type Client,
  type Interaction,
} from "discord.js";
import defaultClient from "./defaultClient";
import GuildConfig from "./GuildConfig";
import interactionCreateListener from "./interactionCreateListener";
import type BotCommand from "./interfaces/BotCommand";
import type BotListener from "./interfaces/BotListener";
import type BotExtension from "./interfaces/BotExtension";

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

  protected extensions: BotExtension[] = [];
  protected listeners: BotListener[] = [];
  protected commands: BotCommand[] = [];
  protected rest: REST;

  constructor(settings = defaultSettings) {
    this.settings = settings;
    this.client = settings.client;
    this.rest = settings.rest.setToken(this.settings.token);
  }

  config(guildId: string) {
    return new GuildConfig(this, guildId);
  }

  async start() {
    // for handling commands
    this.addListeners([interactionCreateListener]);

    for (const extension of this.extensions) {
      extension.up(this);
    }

    this.attachListenersToClient();
    await this.pushCommands();
    await this.client.login(this.settings.token);
  }

  async stop() {
    for (const extension of this.extensions) {
      extension.down(this);
    }
    this.client.removeAllListeners();
    this.client.destroy();
  }

  async handleCommandInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

    const command = this.commands.find(
      (c) =>
        c.builder(new SlashCommandBuilder(), this).name ===
        interaction.commandName
    );
    return command?.handler(interaction, this);
  }

  addExtension(ext: BotExtension) {
    this.extensions.push(ext);
    return this;
  }
  addExtensions(exts: BotExtension[]) {
    for (const ext of exts) {
      this.addExtension(ext);
    }
    return this
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

  addListener(botListener: BotListener) {
    this.listeners.push(botListener);
    return this;
  }
  addListeners(botListeners: BotListener[]) {
    for (const listener of botListeners) {
      this.addListener(listener);
    }
    return this;
  }
  removeListener(listener: BotListener) {
    this.client.off(listener.event, listener.callback);
    this.listeners = this.listeners.filter((l) => l !== listener);
    return this;
  }

  attachListenersToClient() {
    for (const listener of this.listeners) {
      this.client.on(listener.event, (...args: any[]) =>
        listener.callback(this, ...args)
      );
    }
  }
  dettachListenersFromClient() {
    for (const listener of this.listeners) {
      this.client.off(listener.event, listener.callback);
    }
    return this;
  }

  private async pushCommands() {
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
}

import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface BotHandler {
  register: () => void;
  unregister: () => void;
}

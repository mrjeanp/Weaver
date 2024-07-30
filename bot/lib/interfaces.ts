import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface BotCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface BotHandler {
  register: () => void;
  unregister: () => void;
}

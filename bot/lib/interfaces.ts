import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface BotCommandDescriptor {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface ClientEventRegister {
  register: () => void;
  unregister: () => void;
}

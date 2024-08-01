import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type BotCommandBuilder =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export abstract class BotCommand {
  builder: SlashCommandBuilder;

  constructor() {
    this.builder = new SlashCommandBuilder();
    this.describe(this.builder);
  }

  getData() {
    return this.builder.toJSON();
  }

  abstract describe(builder: BotCommandBuilder): BotCommandBuilder;

  abstract handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { Bot } from "../Bot";

export default interface BotCommand {
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

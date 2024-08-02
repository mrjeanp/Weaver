import {
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export type BotCommandBuilder =
  & SlashCommandBuilder
  & SlashCommandOptionsOnlyBuilder
  & SlashCommandSubcommandBuilder
  & SlashCommandSubcommandsOnlyBuilder;


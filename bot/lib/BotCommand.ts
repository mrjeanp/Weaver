import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import type { BotCommandDescriptor } from "./interfaces";

type BotCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandBuilder;

type BotCommandFunction = (interaction: ChatInputCommandInteraction) => void;

export default class BotCommand implements BotCommandDescriptor {
  data: BotCommandData;
  execute: BotCommandFunction;

  constructor(data: BotCommandData, execute: BotCommandFunction) {
    this.data = data;
    this.execute = execute;
  }
}

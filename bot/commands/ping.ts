import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../lib/BotCommand";

export default class PingCommand extends BotCommand {
  describe(builder: SlashCommandBuilder) {
    return builder
      .setName("ping")
      .setDescription("Replies with Pong!")
      .setDefaultMemberPermissions(0);
  }
  async handle(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!");
  }
}

export { PingCommand };

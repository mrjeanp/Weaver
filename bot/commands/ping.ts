import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createCommand } from "../lib/Bot";

export default createCommand(
  (builder: SlashCommandBuilder) => {
    return builder
      .setName("ping")
      .setDescription("Replies with Pong!")
      .setDefaultMemberPermissions(0);
  },
  async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("Pong!");
  }
);

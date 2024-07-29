import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// This command is for testing purposes

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .setDefaultMemberPermissions(0);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("Pong!");
}

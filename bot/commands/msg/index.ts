import {
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  TextChannel,
  type MessageResolvable,
  type TextBasedChannel,
} from "discord.js";

import { getConfig, saveConfig } from "../../lib/config";

export const data = new SlashCommandBuilder()
  .setName("msg")
  .setDescription("Configure a message")
  .addStringOption((option) =>
    option.setName("id").setDescription("Message ID").setRequired(true)
  )
  // .addStringOption((option) =>
  //   option.setName("emoji").setDescription("Assigns this emoji to the ID")
  // )
  .setDefaultMemberPermissions(0)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild()) return;

  const response = await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild?.id!;
  const id = interaction.options.getString("id")?.trim() as string;
  // const emoji = interaction.options.getString("emoji")?.trim();

  const config = await getConfig(guild);

  config.messages[id] = 1;

  await saveConfig(guild, config);

  response.edit("Done");
}

import {
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder
} from "discord.js";

import { getConfig, saveConfig } from "../../lib/config";

export const data = new SlashCommandBuilder();
data
  .setName("groupme")
  .setDescription("Groups messages into one")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message ID of the current channel")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("emojis")
      .setDescription("Space separated emojis to react to the message")
  )
  .setDefaultMemberPermissions(0)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild()) throw "not in guild";

  const guild = interaction.guild as Guild;
  const messageId = interaction.options.getString("message")?.trim() as string;

  const emojisOption = interaction.options.getString("emojis")?.trim();
  const emojis = emojisOption?.split(" ").map((e) => e.trim()) ?? [];

  const channel = interaction.channel;
  const message = await channel?.messages.fetch(messageId);

  if (!message) throw "message not found in this channel";

  const config = await getConfig(guild);

  for (const emoji of emojis) {
    message.react(emoji);
  }

  config.roleme.push(messageId);

  await saveConfig(guild, config);
}

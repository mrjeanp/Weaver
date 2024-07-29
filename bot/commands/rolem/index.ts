import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { saveConfig } from "../../lib/config";

import _unset from "lodash/unset";

export const data = new SlashCommandBuilder()
  .setName("rolem")
  .setDescription("Assigns a role to an emoji")
  .addRoleOption((option) =>
    option.setName("role").setDescription("Role").setRequired(true)
  )
  .addStringOption((option) => option.setName("emoji").setDescription("Emoji"))
  .setDefaultMemberPermissions(0)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild()) throw "not in guild";

  const guild = interaction.guild!;
  const role = interaction.options.getRole("role")!;
  const emoji = interaction.options.getString("emoji");

  if (!emoji) {
    saveConfig(guild, {
      [`rolem.${role.id}`]: undefined,
    });
  } else {
    saveConfig(guild, {
      ["rolem." + role.id]: emoji.trim(),
    });
  }
}

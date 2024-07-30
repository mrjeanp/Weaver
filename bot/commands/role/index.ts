import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { getConfig, saveConfig } from "../../lib/config";

import _unset from "lodash/unset";
import _set from "lodash/set";
import _get from "lodash/get";

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("Configure a role")
  .addRoleOption((option) =>
    option.setName("role").setDescription("Role").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("emoji").setDescription("Assign an emoji to the role")
  )
  .setDefaultMemberPermissions(0)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild()) throw "not in guild";
  const response = await interaction.deferReply({ ephemeral: true });

  const guildId = interaction.guild?.id!;
  const role = interaction.options.getRole("role")!;
  const emoji = interaction.options.getString("emoji")?.trim();
  const config = { ...(await getConfig(guildId)) };
  const roleConfig = _get(config, `roles.${role.id}`);

  if (!emoji || emoji === "0") {
    _unset(config, `roles.${role.id}.emoji`);
  } else {
    _set(config, `roles.${role.id}.emoji`, emoji);
  }

  if (roleConfig && Object.keys(roleConfig).length < 1) {
    _unset(config, `roles.${role.id}`);
  }

  saveConfig(guildId, config);

  response.edit("Done");
}

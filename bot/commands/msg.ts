import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";

import _set from "lodash/set";
import _unset from "lodash/unset";

import { BotCommand, type BotCommandBuilder } from "../lib/BotCommand";
import { getConfig, saveConfig } from "../lib/config";

export class MsgCommand extends BotCommand {
  describe(builder: SlashCommandBuilder): BotCommandBuilder {
    return builder
      .setName("msg")
      .setDescription("Configure a message")
      .addStringOption((option) =>
        option.setName("message").setDescription("Message ID").setRequired(true)
      )
      .addBooleanOption((option) =>
        option.setName("unset").setDescription("Removes message from config.")
      )
      .setDefaultMemberPermissions(0)
      .setDMPermission(false);
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inGuild()) return;

    const response = await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guild?.id!;
    const id = interaction.options.getString("message")?.trim() as string;
    const unset = interaction.options.getBoolean("unset");

    const config = await getConfig(guildId);

    _set(config, `messages.${id}`, {});
    unset && _unset(config, `messages.${id}`);

    saveConfig(guildId, config);
    response.edit("Done");
  }
}

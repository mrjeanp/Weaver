import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import { BotCommand } from "../lib/BotCommand";



export class ReactCommand extends BotCommand {
  describe(builder: SlashCommandBuilder) {
    return builder
      .setName("react")
      .setDescription("Reacts to a message")
      .addStringOption((opt) =>
        opt.setName("message").setDescription("Message ID").setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("emojis")
          .setDescription("Spaced separated emojis")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(0)
      .setDMPermission(false);
  }

  async handle(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) throw "not in guild";
    const response = await interaction.deferReply({ ephemeral: true });
    const msg = interaction.options.getString("message")!;
    const emojis =
      interaction.options.getString("emojis")?.trim().split(/\s+/) ?? [];
    const channel = interaction.channel;

    const message = await channel?.messages.fetch(msg);

    for (const emoji of emojis) {
      await message?.react(emoji);
    }

    response.edit("Done");
  }
}

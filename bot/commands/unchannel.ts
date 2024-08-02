import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  type GuildBasedChannel
} from "discord.js";
import { createCommand } from "../lib/Bot";
import { isCategory } from "../lib/guild-utils";

export default createCommand(
  (builder) => {
    return builder
      .setName("unchannel")
      .setDescription("Removes all channels which name matches a pattern")
      .addStringOption((option) =>
        option
          .setName("pattern")
          .setDescription("String|Regex")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(0)
      .setDMPermission(false);
  },

  async (interaction) => {
    if (!interaction.inGuild()) return;
    if (!interaction.isCommand()) return;

    const guild = interaction.guild!;
    const pattern = interaction.options.getString("pattern") ?? "";

    await interaction.deferReply({ ephemeral: true });

    const regex = new RegExp(pattern, "i");

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Proceed")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      cancel,
      confirm
    );

    const unchannels: Record<string, GuildBasedChannel> = {};

    function addChannel(ch: GuildBasedChannel) {
      if (!unchannels[ch.id]) {
        unchannels[ch.id] = ch;
      }
    }

    for (const [, ch] of guild.channels.cache) {
      if (regex.test(ch.name)) {
        addChannel(ch);
        // is category?
        if (isCategory(ch)) {
          const cat = ch as CategoryChannel;
          cat.children.cache.forEach((c) => {
            if (c.deletable) {
              addChannel(ch);
            }
          });
        }
      }
    }

    const response = await interaction.followUp({
      content: `You are about to delete these channels, are you sure?\n\n${Object.values(
        unchannels
      )
        .map((d) => d.name)
        .join("\n")}\n** **`,
      components: [row],
      ephemeral: true,
    });

    const collectorFilter = (i: any) => i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      if (confirmation.customId === "confirm") {
        for (const channel of Object.values(unchannels)) {
          await channel.delete();
        }
        await confirmation.update({
          content: `OK!`,
          components: [],
        });
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({
          content: "Action cancelled",
          components: [],
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
  }
);

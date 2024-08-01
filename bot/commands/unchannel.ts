import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  type GuildBasedChannel,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { BotCommand, type BotCommandBuilder } from "../lib/BotCommand";

export const data = new SlashCommandBuilder();

export async function execute(interaction: ChatInputCommandInteraction) {}

export class UnchannelCommand extends BotCommand {
  describe(builder: SlashCommandBuilder): BotCommandBuilder {
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
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
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

    const unchannels: GuildBasedChannel[] = [];

    for (const [, ch] of guild.channels.cache) {
      if (regex.test(ch.name)) {
        // is category?
        if (
          !ch.parent &&
          !ch.isDMBased() &&
          !ch.isTextBased() &&
          !ch.isVoiceBased() &&
          !ch.isThread() &&
          !ch.isThreadOnly()
        ) {
          const cat = ch as CategoryChannel;
          cat.children.cache.forEach((c) => {
            if (c.deletable) {
              unchannels.push(c);
            }
          });
        }
        unchannels.push(ch);
      }
    }

    const response = await interaction.followUp({
      content: `Are you sure about deleting these channels?\n\n${unchannels
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
        for (const channel of unchannels) {
          // await channel.delete();
          console.log("unchannel", channel.name);
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
}

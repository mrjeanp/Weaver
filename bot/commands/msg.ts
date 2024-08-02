import { ChatInputCommandInteraction } from "discord.js";

import { createCommand } from "../lib/Bot";
import { _get, _set, _unset } from "../lib/utils/lodash";

export default createCommand(
  (builder) =>
    builder
      .setName("msg")
      .setDescription("Configure a message")
      .addStringOption((option) =>
        option.setName("message").setDescription("Message ID").setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("emojis")
          .setDescription("Adds emojis to this message for role assignment")
      )
      .setDefaultMemberPermissions(0)
      .setDMPermission(false),

  async (interaction: ChatInputCommandInteraction, bot) => {
    if (!interaction.inGuild()) throw "Interaction not in guild";

    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options
      .getString("message")
      ?.trim() as string;
    const newEmojis =
      interaction.options.getString("emojis")?.trim().split(/\s+/) ?? [];

    const guildId = interaction.guild?.id!;
    const channel = interaction.channel;

    let message = channel?.messages.cache.get(messageId);
    message?.partial && message.fetch();
    !message && (message = await channel?.messages.fetch(messageId));

    const config = bot.config(guildId);
    const data = await config.fetch();

    const reactions = message?.reactions.cache;
    const reactedEmojis = reactions?.map(
      (r) => r.emoji.name ?? r.emoji.identifier
    );

    _set(data, `msg.${messageId}`, {});

    if (newEmojis.length)
      _set(data, `msg.${messageId}.emojis`, newEmojis.join(","));

    const msgConfig = _get(data, `msg.${messageId}`);

    if (!Object.keys(msgConfig).length) {
      _unset(data, `msg.${messageId}`);
    } else {
      for (const [, reaction] of message?.reactions.cache ?? []) {
        const remoji = reaction.emoji.name ?? reaction.emoji.identifier;
        // if this reaction is not in new emojis list
        if (!newEmojis.includes(remoji)) {
          await reaction.remove();
        }
      }

      // add new emojis
      for (const emoji of newEmojis) {
        await message?.react(emoji);
      }
    }

    // await saveConfig(guildId, data);
    await config.save(data);

    interaction.editReply({
      content: "Done",
    });
  }
);

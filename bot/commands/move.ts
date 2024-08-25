import type { Message, TextBasedChannel } from "discord.js";
import { createCommand } from "../lib/utils/createCommand";

export default createCommand(
  (builder) => {
    return builder
      .setName("move")
      .setDescription("Move pinned messages to another channel")
      .addChannelOption((opt) =>
        opt
          .setName("channel")
          .setDescription("Target channel")
          .setRequired(true)
      );
  },
  async (interaction) => {
    const guild = interaction.guild;
    const channel = interaction.channel;
    const commandChannel = interaction.options.getChannel("channel");

    await interaction.deferReply({ ephemeral: true });

    const pinned = await channel?.messages.fetchPinned();

    pinned?.forEach(async (msg) => {
      if (msg.partial) await msg.fetch();
      const content = msg.content;
      const chan = guild?.channels.cache.get(
        commandChannel?.id!
      ) as TextBasedChannel;
      await chan.send(content);
      await msg.delete();
    });
    interaction.followUp({ ephemeral: true, content: "Ok" });
  }
);

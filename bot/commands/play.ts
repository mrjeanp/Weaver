import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { createCommand } from "../lib/utils/createCommand";

import path from "path";

export default createCommand(
  (builder: SlashCommandBuilder) => {
    return builder
      .setName("play")
      .setDescription("Play an audio from the /storage directory")
      .addStringOption(
        new SlashCommandStringOption()
          .setName("file")
          .setDescription("Path to the file located in /storage")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(0);
  },
  async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.inGuild()) return;
    await interaction.deferReply({ ephemeral: true });

    const filename = interaction.options.getString("file") ??  "";

    const guild = interaction.guild as Guild;
    const user = interaction.member.user;
    const member = guild?.members.cache.get(user.id);
    const vc = member?.voice.channel;

    if (!vc) throw "You're not connected to a voice channel";

    const connection = joinVoiceChannel({
      adapterCreator: vc?.guild.voiceAdapterCreator,
      channelId: vc?.id ?? "",
      guildId: guild?.id ?? "",
    });

    const player = createAudioPlayer({
      debug: true,
    });

    connection.on(VoiceConnectionStatus.Ready, async () => {
      const filePath = path.join(__dirname, `../../storage`, filename);
      const file = Bun.file(filePath);

      if (!(await file.exists())) throw "File not found";
      console.log("/play", filePath);

      const audio = createAudioResource(filePath, {
        inputType: StreamType.WebmOpus,
      });
      connection.subscribe(player);
      player.play(audio);
    });

    connection.on("error", (err) => {
      player.stop();
      connection.subscribe(player);
    });

    interaction.followUp("Ok!");
  }
);

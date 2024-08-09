import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { createCommand } from "../lib/Bot";

export default createCommand(
  (builder: SlashCommandBuilder) => {
    return builder
      .setName("play")
      .setDescription("Play an audio from the /storage directory")
      .addStringOption(
        new SlashCommandStringOption()
          .setName("filename")
          .setDescription("Path to the file located in /storage")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(0);
  },
  async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.inGuild()) return;

    const filename = interaction.options.getString("filename");

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

    const audioPlayer = createAudioPlayer({
      debug: true,
    });

    const path = require("path");

    const filePath = path.join(__dirname, `../../storage`, filename);

    const file = Bun.file(filePath);

    if (!(await file.exists())) throw "File not found";

    console.log(filePath);

    const audio = createAudioResource(filePath, {
      inputType: StreamType.WebmOpus,
    });

    connection.subscribe(audioPlayer);


    audioPlayer.play(audio);

    interaction.followUp("Ok!");
  }
);

import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { BaseGuildTextChannel, Events, VoiceState } from "discord.js";
import BotListener from "../lib/BotListener";

const audioPlayer = createAudioPlayer();
const getAudio = () =>
  createAudioResource("../../assets/audio/elevator-music.mp3");

export const voiceListener = new BotListener(
  Events.VoiceStateUpdate,
  async (oldState: VoiceState, newState: VoiceState) => {
    const client = newState.client;
    if (newState.member?.id === client.user?.id) return;
    const newVC = newState.channel;
    const oldVC = oldState.channel;
    const guild = newState.guild;
    const chLog = guild.channels.cache.find(
      (ch) => ch.name === "bellboy-debug"
    ) as BaseGuildTextChannel | undefined;

    // only bot left in channel
    if (oldVC?.members.size === 1) {
      const conn = getVoiceConnection(oldVC.guild.id);
      conn?.destroy();
      return;
    }

    if (newVC?.name.toLocaleLowerCase().includes("lobby")) {
      if (newVC.members.size >= 1) {
        const connection = joinVoiceChannel({
          channelId: newVC.id,
          guildId: newVC.guild.id,
          adapterCreator: newVC.guild.voiceAdapterCreator,
          selfMute: false,
          debug: true,
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
          if (chLog) {
            audioPlayer.on("debug", (message) => {
              chLog?.send(message);
            });
          }

          audioPlayer.on(AudioPlayerStatus.Idle, (_olds, _news) => {
            audioPlayer.play(getAudio());
          });

          const _sub = connection.subscribe(audioPlayer);

          audioPlayer.play(getAudio());
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy();
          }
        });
      }
    }
  }
);

import {
  entersState,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import {
  type GuildBasedChannel,
  type GuildTextBasedChannel,
  type TextBasedChannel,
} from "discord.js";

export async function getLastMessage(channel: GuildTextBasedChannel) {
  let msgs = await channel.messages.fetch({ limit: 1 });
  const msg = msgs.first();
  return msg;
}

export function isCategory(channel: GuildBasedChannel) {
  if (
    !channel.parent &&
    !channel.isDMBased() &&
    !channel.isTextBased() &&
    !channel.isVoiceBased() &&
    !channel.isThread() &&
    !channel.isThreadOnly()
  ) {
    return true;
  } else {
    return false;
  }
}

export async function findMessageById(
  channel: TextBasedChannel,
  messageId: string
) {
  let msg = channel.messages.cache.get(messageId);
  msg?.partial && (await msg?.fetch(true));

  if (!msg) {
    msg = await channel.messages.fetch(messageId);
  }
  return msg;
}

export async function tryVoiceReconnection(connection: VoiceConnection) {
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
}

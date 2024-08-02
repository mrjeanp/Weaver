import {
  type GuildBasedChannel,
  type GuildTextBasedChannel,
  type TextBasedChannel
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


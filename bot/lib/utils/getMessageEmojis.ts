import type { Message } from "discord.js";

export default async function getMessageEmojis(message: Message) {
  if (message.partial) await message.fetch();

  const emojis = message.reactions.cache.map(
    (r) => r.emoji.name ?? r.emoji.identifier
  );

  return emojis;
}

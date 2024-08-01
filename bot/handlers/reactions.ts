import {
  Events
} from "discord.js";
import assert from "../lib/assert.fn";
import { getConfig, getEmojis } from "../lib/config";
import { BotListener } from "../lib/BotListener";

const reactionAddListener = new BotListener(
  Events.MessageReactionAdd,
  async (reaction, user) => {
    try {
      const botId = reaction.client.user.id;
      const message = reaction.message;
      const emoji = reaction.emoji.name ?? "";
      const guildId = message.guildId;
      const guild = message.guild;

      if (!message.inGuild() || botId === user.id) return;

      const config = await getConfig(guildId ?? "");
      const _emojis = await getEmojis(guildId ?? "");

      assert(message.id in config.messages, "message id not registered");
      assert(emoji in _emojis, "emoji not registered");

      const roleId = _emojis[emoji];

      await guild?.members.addRole({
        role: roleId,
        user: user.id,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

const reactionRemoveListener = new BotListener(
  Events.MessageReactionRemove,
  async (reaction, user) => {
    try {
      const botId = reaction.client.user.id;
      const message = reaction.message;
      const emoji = reaction.emoji.name ?? "";
      const guildId = message.guildId;
      const guild = message.guild;

      if (!message.inGuild() || botId === user.id) return;

      const config = await getConfig(guildId ?? "");
      const _emojis = await getEmojis(guildId ?? "");

      assert(message.id in config.messages, "message id not registered");
      assert(emoji in _emojis, "emoji not registered");

      const role = _emojis[emoji];
      await guild!.members.removeRole({
        role,
        user: user.id,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export { reactionAddListener, reactionRemoveListener };

import {
  Events,
  MessageReaction,
  User,
  type PartialMessageReaction,
  type PartialUser,
} from "discord.js";
import client from "../../lib/client";
import type { BotHandler } from "../../lib/interfaces";
import { getConfig, getEmojis } from "../../lib/config";
import _has from "lodash/has";
import assert from "../../lib/assert.fn";

let addHandler: (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => void;
let removeHandler: (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => void;

export default {
  register() {
    client.on(
      Events.MessageReactionAdd,
      (addHandler = async (reaction, user) => {
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
      })
    );

    client.on(
      Events.MessageReactionRemove,
      (removeHandler = async (reaction, user) => {
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
      })
    );
  },

  unregister() {
    client.off(Events.MessageReactionAdd, addHandler);
    client.off(Events.MessageReactionRemove, removeHandler);
  },
} as BotHandler;

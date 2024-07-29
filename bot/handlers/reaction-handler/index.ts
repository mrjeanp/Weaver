import {
  Events,
  MessageReaction,
  User,
  type PartialMessageReaction,
  type PartialUser,
} from "discord.js";
import client from "../../lib/client";
import type { BotHandler } from "../../lib/interfaces";
import { getConfig } from "../../lib/config";

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
          if (reaction.client.user.id === user.id) return;

          reaction.partial && (await reaction.fetch());

          const { message, emoji } = reaction;
          const emoj = emoji.name ?? emoji.identifier;

          message.partial && (await message.fetch());

          const { guild } = message;

          if (!guild) throw "message not in guild";

          const { roleme, _emojis = {} } = await getConfig(guild);

          if (roleme.includes(message.id) && emoj in _emojis) {
            const role = _emojis[emoj];
            await guild.members.addRole({
              role,
              user: user.id,
            });
          }
        } catch (err) {
          console.error(err);
        }
      })
    );

    client.on(
      Events.MessageReactionRemove,
      (removeHandler = async (reaction, user) => {
        try {
          reaction.partial && (await reaction.fetch());

          const { message, emoji } = reaction;
          message.partial && (await message.fetch());

          const { guild } = message;

          if (!guild) throw "message not in guild";

          const emoj = emoji.name ?? "";
          const { _emojis: emojis = {}, roleme } = await getConfig(guild);

          if (roleme.includes(message.id) && emoj in emojis) {
            const role = emojis[emoj];
            await guild.members.removeRole({
              role,
              user: user.id,
            });
          }
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

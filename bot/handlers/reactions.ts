import { Events } from "discord.js";
import _findKey from "lodash/findKey";
import _get from "lodash/get";
import { createListener } from "../lib/Bot";

export const reactionAddListener = createListener(
  Events.MessageReactionAdd,
  async (bot, reaction, user) => {
    try {
      const botId = reaction.client.user.id;
      const message = reaction.message;
      message.partial && (await message.fetch());
      const emoji = reaction.emoji.name ?? reaction.emoji.identifier;
      const guild = message.guild;
      const guildId = message.guildId;

      if (!guildId || botId === user.id) return;

      const config = bot.config(guildId);
      const data = await config.fetch();

      const messageConfig = _get(data, `msg.${message.id}`) ?? {};

      const roleId = _findKey(data.roles, (o) => o.emoji === emoji) ?? "";
      const role = await guild?.roles.fetch(roleId);
      const roleEmoji = _get(data, `roles.${roleId}.emoji`);
      const messageEmojis = (messageConfig.emojis ?? "").split(",") ?? [];

      if (messageEmojis.includes(roleEmoji)) {
        await guild?.members.addRole({
          role: roleId,
          user: user.id,
        });
        user.send({
          content: `You have been assigned the role: ${roleEmoji} ${role?.name}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const reactionRemoveListener = createListener(
  Events.MessageReactionRemove,
  async (bot, reaction, user) => {
    try {
      const botId = reaction.client.user.id;
      const message = reaction.message;
      message.partial && (await message.fetch());
      const emoji = reaction.emoji.name ?? "";
      const guildId = message.guildId;
      const guild = message.guild;

      if (!guildId || !guild || botId === user.id) return;

      const config = bot.config(guildId);
      const data = await config.fetch();

      const messageConfig = _get(data, `msg.${message.id}`) ?? {};

      const roleId = _findKey(data.roles, (o) => o.emoji === emoji) ?? "";
      const role = await guild.roles.fetch(roleId);
      const roleEmoji = _get(data, `roles.${roleId}.emoji`);
      const messageEmojis = (messageConfig.emojis ?? "").split(",") ?? [];

      if (messageEmojis.includes(roleEmoji)) {
        await guild!.members.removeRole({
          role: roleId,
          user: user.id,
        });
        user.send({
          content: `You have been unnasigned the role: ${roleEmoji} ${role?.name}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
);

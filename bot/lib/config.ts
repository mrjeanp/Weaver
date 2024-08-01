import {
  ChannelType,
  PermissionsBitField,
  type Message,
  type TextChannel
} from "discord.js";
import _get from "lodash/get";
import _set from "lodash/set";
import client from "./client";


const configChannelName = process.env.CONFIG_CHANNEL ?? 'bellboy'

export type BotConfig = {
  this: {
    channel: string;
    message: string;
  };

  roles: Record<
    string,
    {
      emoji: string;
    }
  >;
  messages: Record<string, any>;
};

const initConfig: BotConfig = {
  this: {
    message: "",
    channel: "",
  },
  roles: {},
  messages: {},
};

const _config: Record<string, BotConfig> = {};
const _emojis: Record<string, any> = {};

export const getConfig = async (guildId: string) => {
  if (_config[guildId]) return { ..._config[guildId] };

  let config = { ...initConfig };
  let guild = client.guilds.cache.get(guildId);

  let chan = guild?.channels.cache.find(
    (ch) => ch.name === configChannelName && ch.isTextBased()
  ) as TextChannel | undefined;

  let message = chan
    ? (await chan?.messages.fetch({ limit: 1 })).last()
    : undefined;

  if (!guild) {
    throw "Guild not found!";
  }
  if (!chan) {
    chan = await guild.channels.create({
      name: configChannelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.All],
        },
      ],
    });
  }

  if (!message) {
    message = await chan.send("Creating configuration...");

    config["this"] = {
      channel: chan.id,
      message: message.id,
    };

    await message?.edit(JSON.stringify(config));
  } else {
    config = JSON.parse(message.content);
  }

  saveCache(guildId, config);
  return config;
};

/**
 * Saves configuration
 *
 * @param guildId string
 * @param confs lodash config keys
 * @returns
 */
export const saveConfig = async (
  guildId: string,
  confs: BotConfig | Record<string, any>
) => {
  const config = await getConfig(guildId);
  const guild = client.guilds.cache.get(guildId);

  const channelId = _get(config, "this.channel") as string;
  const messageId = _get(config, "this.message") as string;

  const channel = guild && (guild.channels.cache.get(channelId) as TextChannel);
  const message =
    channel && (channel.messages.cache.get(messageId) as Message<true>);

  if (!message) return;

  for (const [path, value] of Object.entries(confs)) {
    _set(config, path, value);
  }

  await message.edit(JSON.stringify(config));

  saveCache(guildId, config);
};

const saveCache = async (guildId: string, config: BotConfig) => {
  _config[guildId] = { ...config };

  for (const [roleId, roleConfig] of Object.entries(config.roles)) {
    roleConfig.emoji && _set(_emojis, `${guildId}.${roleConfig.emoji}`, roleId);
  }
};

export const getEmojis = async (guildId: string) => {
  // if (_emojis[guildId]) return _emojis[guildId];
  await getConfig(guildId);

  return _emojis[guildId];
};

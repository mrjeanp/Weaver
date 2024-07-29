import type {
  Guild,
  Message,
  MessageResolvable,
  TextChannel,
} from "discord.js";
import _get from "lodash/get";
import _invert from "lodash/invert";
import _set from "lodash/set";

export type BotConfig = {
  this: {
    channel: string;
    message: string;
  };

  rolem: Record<string, string>;
  roleme: MessageResolvable[];

  _emojis?: Record<string, string>;
};

const cache: Record<string, BotConfig> = {};

export const saveConfig = async (
  guild: Guild,
  confs: BotConfig | Record<string, any>
) => {
  const config = await getConfig(guild);

  for (const [path, value] of Object.entries(confs)) {
    _set(config, path, value);
  }

  const channelId = _get(config, "this.channel") as string;
  const messageId = _get(config, "this.message") as string;

  const channel = guild.channels.cache.get(channelId) as TextChannel;
  const message = channel.messages.cache.get(messageId) as Message<true>;

  await message.edit(
    JSON.stringify({
      ...config,
      _emojis: undefined,
    } as BotConfig)
  );

  saveCache(guild, config);
};

export const getConfig = async (guild: Guild) => {
  if (cache[guild.id]) return { ...cache[guild.id] };

  let config: BotConfig = {
    this: {
      message: "",
      channel: "",
    },
    rolem: {},
    roleme: [],
  };

  const chan = guild.channels.cache.find(
    (ch) => ch.name === "bellboy"
  ) as TextChannel;

  if (chan.partial) {
    await chan.fetch(true);
  }

  let message = (await chan.messages.fetch({ limit: 1 })).last();

  if (!message) {
    message = await chan.send("Creating configuration...");

    config["this"] = {
      channel: chan.id,
      message: message.id,
    };

    await message?.edit(
      JSON.stringify({
        ...config,
        _emojis: undefined,
      } as BotConfig)
    );
  } else {
    config = JSON.parse(message.content);
  }

  saveCache(guild, {
    ...config,
  });

  return config;
};

const saveCache = (guild: Guild, config: BotConfig) => {
  cache[guild.id] = {
    ...config,
    _emojis: _invert(config.rolem),
  };
};



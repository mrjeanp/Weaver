import {
  ChannelType,
  PermissionsBitField,
  type Client,
  type Guild,
  type GuildTextBasedChannel
} from "discord.js";
import type { Bot } from "./Bot";
import { getLastMessage } from "./guild-utils";

const configChannelName = process.env.CONFIG_CHANNEL ?? "weaver";

export default class GuildConfig {
  bot: Bot;
  client: Client;
  guildId: string;

  constructor(bot: Bot, guildId: string) {
    this.bot = bot;
    this.client = bot.client;
    this.guildId = guildId;
  }

  async fetch() {
    const guildId = this.guildId;
    let guild = this.client.guilds.cache.get(guildId);

    if (!guild) throw "Guild not found";

    const chan = await this.getConfigChannel(guild);
    const message = await this.getConfigMessage(chan);

    const json = message.content;

    return JSON.parse(json);
  }

  async save(obj: object) {
    const guildId = this.guildId;
    const guild = this.client.guilds.cache.get(guildId)!;

    if (!guild) throw "Guild not found";

    const channel = await this.getConfigChannel(guild);
    const message = await this.getConfigMessage(channel);

    await message.edit(JSON.stringify(obj));

    return true;
  }

  async getConfigMessage(channel: GuildTextBasedChannel) {
    let message = await getLastMessage(channel);

    if (!message) {
      message = await channel.send("{}");
    }

    return message;
  }

  async getConfigChannel(guild: Guild) {
    let chan = guild?.channels.cache.find(
      (ch) => ch.isTextBased() && ch.name === configChannelName
    ) as GuildTextBasedChannel | undefined;

    chan?.partial && (await chan.fetch());

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
    return chan;
  }
}

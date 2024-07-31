import { Client, Events } from "discord.js";
import client from "../../lib/client";
import { getConfig } from "../../lib/config";
import type { ClientEventRegister } from "../../lib/interfaces";
import BotHandler from "../../lib/BotListener";

let handler: { (client: Client<true>): void } | undefined;

export default new BotHandler().listen(
  Events.ClientReady,
  async (client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    client.user.setUsername("Weaver")

    for (const [, guild] of client.guilds.cache) {
      await getConfig(guild.id);
    }
  }
);

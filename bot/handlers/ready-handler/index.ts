import { Client, Events } from "discord.js";
import BotHandler from "../../lib/BotHandler";
import { getConfig } from "../../lib/config";


export default new BotHandler().listen(
  Events.ClientReady,
  async (client) => {
    console.log(`${client.user?.tag} is ready!`);

    client.user.setUsername("Weaver")

    for (const [, guild] of client.guilds.cache) {
      await getConfig(guild.id);
    }
  }
);

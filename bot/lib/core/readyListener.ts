import { Events } from "discord.js";
import { getConfig } from "../config";
import { BotListener } from "../BotListener";

export default new BotListener(Events.ClientReady, async ( client) => {
  console.log(`${client.user?.tag} is ready!`);

  for (const [, guild] of client.guilds.cache) {
    await getConfig(guild.id);
  }
});

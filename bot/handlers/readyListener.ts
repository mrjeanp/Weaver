import { Events } from "discord.js";
import { createListener } from "../lib/Bot";

export default createListener(Events.ClientReady, async (_bot, client) => {
  console.log(`${client.user?.tag} is ready!`);
});

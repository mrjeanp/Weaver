import { Events } from "discord.js";
import createListener from "../lib/utils/createListener";
import { startServer } from "../extensions/lofi/wss";

export default createListener(Events.ClientReady, async (_bot, client) => {
  console.log(`${client.user?.tag} is ready!`);
});

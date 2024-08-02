import { Client, Events } from "discord.js";
import client from "../../bot/lib/defaultClient";
import { getConfig } from "../../bot/lib/guild-utils";
import type { ClientEventRegister } from "../../bot/lib/interfaces";

let handler: { (client: Client<true>): void } | undefined;

export default {
  register() {
    client.once(
      Events.ClientReady,
      (handler = async (client) => {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        for (const [, guild] of client.guilds.cache) {
          await getConfig(guild);
        }
      })
    );
  },
  unregister() {
    handler && client.off(Events.ClientReady, handler);
    handler = undefined;
  },
} as ClientEventRegister;

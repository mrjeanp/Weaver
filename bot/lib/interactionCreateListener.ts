import { Events } from "discord.js";
import createListener from "./utils/createListener";

export default createListener(
  Events.InteractionCreate,
  async (bot, interaction) => {
    if (!interaction.isCommand()) return;
    try {
      await bot.handleCommandInteraction(interaction);
    } catch (error: any) {
      interaction.followUp(
        `Error: ${typeof error === "string" ? error : error.message}`
      );
      console.error(error);
    }
  }
);

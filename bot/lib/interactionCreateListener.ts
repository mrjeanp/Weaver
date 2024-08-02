import { Events } from "discord.js";
import { createListener } from "./Bot";

export default createListener(
  Events.InteractionCreate,
  async (bot, interaction) => {
    if (!interaction.isCommand()) return;
    try {
      await bot.handleCommandInteraction(interaction);
    } catch (error) {
      console.error(error);
    }
  }
);

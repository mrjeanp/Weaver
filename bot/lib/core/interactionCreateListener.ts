import { ApplicationCommandType, Events } from "discord.js";
import { Bot } from "../Bot";
import { BotListener } from "../BotListener";

export default new BotListener(
  Events.InteractionCreate,
  async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandType !== ApplicationCommandType.ChatInput) return;
    try {
      const bot = Bot.instance;
      await bot.handleCommandInteraction(interaction);
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "ERROR",
        ephemeral: true,
      });
    }
  }
);

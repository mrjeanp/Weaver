import { ApplicationCommandType, Events, type Interaction } from "discord.js";
import { loadCommand } from "../../lib/loader";
import client from "../../lib/client";
import type { ClientEventRegister as ClientEventRegistrar } from "../../lib/interfaces";

export function register() {
  client.on(Events.InteractionCreate, handle);
}

export async function handle(interaction: Interaction) {
  if (!interaction.isCommand()) return;
  if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

  try {
    const command = await loadCommand(interaction.commandName);
    console.log("Loaded command", command.data.name);
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: "ERROR",
      ephemeral: true,
    });
  }
}

export function unregister() {
  client.off(Events.InteractionCreate, handle);
}

export default {
  register,
  unregister,
} as ClientEventRegistrar;

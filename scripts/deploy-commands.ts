import { REST, Routes } from "discord.js";
import { loadAllCommands } from "../bot/lib/loader";

// ENVIRONMENT
const clientId = process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const rest = new REST().setToken(token ?? "");

try {
  console.log(`Deploying commands.`);

  const commands = await loadAllCommands();
  const cmds = commands.map((c) => c.data);

  if (!clientId) throw "no client ID";
  if (!guildId) throw "no guild ID";

  if (cmds.length < 1) throw "no commands found";

  let data: any[] = [];

  if (guildId) {
    data = (await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: cmds,
    })) as any[];
  }

  console.log(`Successfully deployed ${data.length} application (/) commands.`);
} catch (error) {
  console.error(error);
}

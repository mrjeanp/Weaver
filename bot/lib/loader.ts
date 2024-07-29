import path from "path";
import type { BotCommand, BotHandler } from "./interfaces";
import { Glob } from "bun";
import { readdir } from "node:fs/promises";

export const commandsDir = process.cwd() + "/bot/commands";
export const handlersDir = process.cwd() + "/bot/handlers";

const commandCache: Record<string, BotCommand> = {};
const handlerCache: Record<string, BotHandler> = {};

export async function unloadHandler(handlerName: string): Promise<void> {
  const handler = await loadHandler(handlerName);

  handler.unregister();
}

export async function loadHandler(handlerName: string): Promise<BotHandler> {
  const cached = handlerCache[handlerName];

  if (cached) return cached;

  const module = require(path.join(handlersDir, handlerName));
  const handler = module.default || module;

  commandCache[handlerName] = handler;

  console.log("loaded handler", handlerName);

  return handler;
}

export async function* loadHandlers(handlerNames: string[]) {
  for (const name of handlerNames) {
    const handler = await loadHandler(name);
    yield handler;
  }
}

export async function loadCommand(commandName: string): Promise<BotCommand> {
  const cached = commandCache[commandName];

  if (cached) return cached;

  const module = require(path.join(commandsDir, commandName));
  const command = module.default || module;

  commandCache[commandName] = command;

  console.log("loaded command", commandName);

  return command;
}

export async function* loadCommands(commandNames: string[]) {
  for (const name of commandNames) {
    const command = await loadCommand(name);
    yield command;
  }
}

export async function loadAllCommands() {
  const dirs = await readdir(path.join(__dirname, "../commands"));

  const cmds: BotCommand[] = [];
  
  for (const dir of dirs) {
    cmds.push(await loadCommand(dir));
  }

  return cmds;
}

export default {
  loadCommand,
  loadCommands,
};

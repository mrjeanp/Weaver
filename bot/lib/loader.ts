import { readdir } from "node:fs/promises";
import path from "path";
import type { BotCommand, BotHandler } from "./interfaces";

export const commandsDir = path.join(__dirname, "../commands");
export const handlersDir = path.join(__dirname, "../handlers");

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

  return command;
}

export async function* loadCommands(commandNames: string[]) {
  for (const name of commandNames) {
    const command = await loadCommand(name);
    yield command;
  }
}

export async function loadAllCommands() {
  const dirs = await readdir(commandsDir);

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

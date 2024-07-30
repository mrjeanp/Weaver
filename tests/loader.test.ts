import { expect, test, describe } from "bun:test";
import {
  loadAllCommands,
  loadCommand,
  loadCommands,
  loadHandler,
  loadHandlers,
} from "../bot/lib/loader";

test("Loading 1 command", async () => {
  const pingCommand = await loadCommand("ping");
  expect(pingCommand.data).not.toBeNull();
});

test("Loading multiple comands", async () => {
  for await (const command of loadCommands(["ping", "unchannel"])) {
    expect(command?.data).not.toBeNull();
  }
});

test("Loading all commands", async () => {
  const loaded = await loadAllCommands();

  expect(loaded).not.toBeEmpty();
  expect(loaded.length).toEqual(5);
});

test("Loading 1 handler", async () => {
  const handler = await loadHandler("command-handler");
  expect(handler.register).not.toBeNull();
  expect(handler.unregister).not.toBeNull();
});

test("Loading multiple handlers", async () => {
  const handlers = loadHandlers(["command-handler"]);

  for await (const handler of handlers) {
    expect(handler.register).not.toBeNull();
    expect(handler.unregister).not.toBeNull();
  }
});

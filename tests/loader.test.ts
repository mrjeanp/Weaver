import { expect, test, describe } from "bun:test";
import {
  loadAllCommands,
  loadCommand,
  loadCommands,
  loadHandler,
  loadHandlers,
} from "../bot/lib/loader";

describe("Loader library", () => {
  test("loading 1 command works", async () => {
    const pingCommand = await loadCommand("ping");
    expect(pingCommand.data).not.toBeNull();
  });

  test("loading multiple comands works", async () => {
    for await (const command of loadCommands(["ping", "unchannel"])) {
      expect(command?.data).not.toBeNull();
    }
  });

  test("loading all commands  works", async () => {
    const loaded = await loadAllCommands();

    expect(loaded).not.toBeEmpty();
    expect(loaded.length).toEqual(5);
  });
});

describe("Loading handlers", () => {
  test("loadHander works", async () => {
    const handler = await loadHandler("command-handler");
    expect(handler.register).not.toBeNull();
    expect(handler.unregister).not.toBeNull();
  });

  test("loadHanders works", async () => {
    const handlers = loadHandlers(["command-handler"]);

    for await (const handler of handlers) {
      expect(handler.register).not.toBeNull();
      expect(handler.unregister).not.toBeNull();
    }
  });
});

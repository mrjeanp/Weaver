
import client from "./lib/client";
import { loadHandlers } from "./lib/loader";

// console.log(generateDependencyReport());

// Register handlers
const handlers = loadHandlers([
  "command-handler",
  "reaction-handler",
  "ready-handler",
  "voice-handler",
]);

for await (const handler of handlers) {
  handler.register();
}

// start bot
client.login(process.env.DISCORD_TOKEN);

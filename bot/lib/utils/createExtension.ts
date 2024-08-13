import type BotExtension from "../interfaces/BotExtension";

export default function createExtension({
  up,
  down,
}: Partial<BotExtension>): BotExtension {
  return {
    up: up ?? (()=>{}),
    down: down ?? (()=>{}),
  };
}

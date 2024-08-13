import type BotCommand from "../interfaces/BotCommand";


export function createCommand(
  builder: BotCommand["builder"],
  handler: BotCommand["handler"]
) {
  return {
    builder,
    handler,
  };
}

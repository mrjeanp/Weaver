import type { Bot } from "../Bot";

export default interface BotExtension {
  up: (bot: Bot) => void;
  down: (bot: Bot) => void;
}

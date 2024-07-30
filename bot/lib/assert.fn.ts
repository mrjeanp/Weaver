export default function assert(condition: boolean, msg?: string) {
  if (!condition) {
    throw `Assertion failed${msg ? ": " + msg : ""}`;
  }
}

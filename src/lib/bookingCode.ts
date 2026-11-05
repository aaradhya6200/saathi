import "server-only";
import { randomInt } from "crypto";

// No 0/O/1/I so codes are easy to read out on the phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function newBookingCode(): string {
  let s = "";
  for (let i = 0; i < 5; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return "SA-" + s;
}

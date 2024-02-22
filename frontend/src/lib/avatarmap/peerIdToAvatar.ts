import { Avatar } from "../types/Avatar";
import ANIMALCOLORS from "./animalColors";
import ANIMALS from "./animals";

export function peerIdToAvatar(peerId: string): Avatar {
  const numbers = peerId.replace(/\D/g, "");
  const animalIndex = (BigInt(numbers) * BigInt(13)) % BigInt(ANIMALS.length);
  const colorIndex = (BigInt(numbers) * BigInt(13)) % BigInt(ANIMALCOLORS.length);
  return { animal: ANIMALS[Number(animalIndex)], color: ANIMALCOLORS[Number(colorIndex)] };
}

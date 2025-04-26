import { Animal, AnimalState } from "../Animal.js";
import { bunnyAnimations } from "./animations.js";

export type BunnyState = AnimalState | "jump" | "run" | "lick" | "play";

export class Bunny extends Animal<BunnyState> {
  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 3,
      animations: bunnyAnimations,
    });
  }
}

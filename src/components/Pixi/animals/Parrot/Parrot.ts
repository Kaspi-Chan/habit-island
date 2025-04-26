import { Animal, AnimalState } from "../Animal.js";
import { parrotAnimations } from "./animations.js";

export type ParrotState = AnimalState | "fly" | "sit" | "walk";

export class Parrot extends Animal<ParrotState> {
  constructor() {
    super({
      width: 16,
      height: 16,
      scale: 2,
      animations: parrotAnimations,
    });
  }

  protected onStateChanged(newState: ParrotState): void {
    switch (newState) {
      case "fly":
        this.startMoving(60);
        break;

      case "walk":
        this.startMoving(20);
        break;

      default:
        // idle, sleep, lick, play → stop moving
        this.stopMoving();
        break;
    }
  }

  protected onTargetReached() {
    this.play("idle");
  }
}

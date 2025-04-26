import { Animal, AnimalState } from "../Animal.js";
import { foxAnimations } from "./animations.js";

export type FoxState = AnimalState | "jump" | "sit" | "walk";

export class Fox extends Animal<FoxState> {
  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 3.25,
      animations: foxAnimations,
    });
  }

  protected onStateChanged(newState: FoxState): void {
    switch (newState) {
      case "jump":
        this.startMoving(75);
        break;

      case "walk":
        this.startMoving(50);
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

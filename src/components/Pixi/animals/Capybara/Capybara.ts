import { Animal, AnimalState } from "../Animal.js";
import { capybaraAnimations } from "./animations.js";

export type CapybaraState = AnimalState | "happy" | "walk";

export class Capybara extends Animal<CapybaraState> {
  constructor() {
    super({
      width: 64,
      height: 64,
      scale: 2,
      animations: capybaraAnimations,
    });
  }

  protected onStateChanged(newState: CapybaraState): void {
    switch (newState) {
      case "walk":
        this.startMoving(60);
        break;

      default:
        this.stopMoving();
        break;
    }
  }

  protected onTargetReached() {
    this.play("idle");
  }
}

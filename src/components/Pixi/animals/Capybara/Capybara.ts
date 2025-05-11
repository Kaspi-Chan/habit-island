import { getRandomString } from "../../../../utils/utils.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState, HitBoxConfig } from "../Animal.js";
import { capybaraAnimations } from "./animations.js";

export type CapybaraState = AnimalState | "happy" | "walk";
const capybaraStates: CapybaraState[] = ["idle", "sleep", "happy", "walk"];

export class Capybara extends Animal<CapybaraState> {
  private initialState: CapybaraState = getRandomString(capybaraStates);
  static hitBoxConfig: HitBoxConfig = { w: 0.6, h: 0.6 };

  constructor() {
    super({
      width: 64,
      height: 64,
      scale: 1.6,
      animations: capybaraAnimations,
    });

    this.zIndex = 40;
    this.initStates();
  }

  protected initStates() {
    this.fsm = new StateMachine<CapybaraState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
        },
        getNext: () => getRandomString(capybaraStates),
      },
      sleep: {
        duration: { min: 30, max: 40 },
        onEnter: () => {
          this.play("sleep");
        },
        getNext: () => "idle",
      },
      happy: {
        duration: { min: 3, max: 5 },
        onEnter: () => {
          this.play("happy");
        },
        getNext: () => "idle",
      },
      walk: {
        onEnter: () => {
          this.play("walk");
          this.startMoving(60);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "walk"),
      },
    });
  }

  protected onTargetReached() {
    this.fsm.transition();
  }
}

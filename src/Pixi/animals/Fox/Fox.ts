import { getRandomString } from "../../../utils/utils.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState, HitBoxConfig } from "../Animal.js";
import { foxAnimations } from "./animations.js";

export type FoxState = AnimalState | "jump" | "sit" | "walk";
const foxStates: FoxState[] = ["idle", "sleep", "jump", "sit", "walk"];

export class Fox extends Animal<FoxState> {
  private initialState: FoxState = getRandomString(foxStates);
  static hitBoxConfig: HitBoxConfig = { w: 0.6, h: 0.5, offsetY: 25 };

  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 3.25,
      animations: foxAnimations,
    });

    this.zIndex = 30;
    this.initStates();
  }

  protected initStates() {
    this.fsm = new StateMachine<FoxState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
        },
        getNext: () => getRandomString(foxStates),
      },
      sleep: {
        duration: { min: 30, max: 40 },
        onEnter: () => {
          this.play("sleep");
        },
        getNext: () => "idle",
      },
      sit: {
        duration: { min: 3, max: 7 },
        onEnter: () => {
          this.play("sit");
        },
        getNext: () => getRandomString(foxStates),
      },
      jump: {
        onEnter: () => {
          this.play("jump");
          this.startMoving(75);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "walk"),
      },
      walk: {
        onEnter: () => {
          this.play("walk");
          this.startMoving(50);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "jump"),
      },
    });
  }
}

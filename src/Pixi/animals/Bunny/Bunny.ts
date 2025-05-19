import { getRandomString } from "../../../utils/utils.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState } from "../Animal.js";
import { bunnyAnimations } from "./animations.js";

export type BunnyState = AnimalState | "jump" | "run" | "lick" | "play";
const bunnyStates: BunnyState[] = [
  "idle",
  "sleep",
  "jump",
  "run",
  "lick",
  "play",
];

export class Bunny extends Animal<BunnyState> {
  private initialState: BunnyState = getRandomString(bunnyStates);

  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 1.5,
      animations: bunnyAnimations,
    });

    this.initStates();
    this.zIndex = 10;
  }

  protected initStates() {
    this.fsm = new StateMachine<BunnyState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
        },
        getNext: () => getRandomString(bunnyStates),
      },
      sleep: {
        duration: { min: 30, max: 40 },
        onEnter: () => {
          this.play("sleep");
        },
        getNext: () => "idle",
      },
      run: {
        onEnter: () => {
          this.play("run");
          this.startMoving(100);
        },
        onExit: () => this.stopMoving(),
        getNext: () => "idle",
      },
      jump: {
        onEnter: () => {
          this.play("jump");
          this.startMoving(75);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "jump"),
      },
      lick: {
        duration: { min: 3, max: 5 },
        onEnter: () => {
          this.play("lick");
        },
        getNext: () => (Math.random() < 0.5 ? "idle" : "play"),
      },
      play: {
        duration: { min: 3, max: 5 },
        onEnter: () => {
          this.play("play");
        },
        getNext: () => (Math.random() < 0.5 ? "idle" : "lick"),
      },
    });
  }

  protected onTargetReached() {
    this.fsm.transition();
  }
}

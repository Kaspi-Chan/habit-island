import { getRandomString } from "../../../utils/utils.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState, HitBoxConfig } from "../Animal.js";
import { turtleAnimations } from "./animations.js";

export type TurtleState =
  | AnimalState
  | "jump"
  | "walk"
  | "hide"
  | "sit"
  | "lie";
const turtleStates: TurtleState[] = [
  "idle",
  "sleep",
  "jump",
  "hide",
  "sit",
  "lie",
  "walk",
];

export class Turtle extends Animal<TurtleState> {
  private initialState: TurtleState = getRandomString(turtleStates);
  static hitBoxConfig: HitBoxConfig = { w: 0.8, h: 0.8, offsetY: 10 };

  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 1.5,
      animations: turtleAnimations,
    });

    this.initStates();
    this.zIndex = 10;
  }

  protected initStates() {
    this.fsm = new StateMachine<TurtleState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
        },
        getNext: () => getRandomString(turtleStates),
      },
      sleep: {
        duration: { min: 30, max: 40 },
        onEnter: () => {
          this.play("sleep");
        },
        getNext: () => "idle",
      },
      walk: {
        onEnter: () => {
          this.play("walk");
          this.startMoving(20);
        },
        onExit: () => this.stopMoving(),
        getNext: () => "idle",
      },
      jump: {
        duration: { min: 5, max: 7 },
        onEnter: () => {
          this.play("jump");
        },
        getNext: () => getRandomString(turtleStates),
      },
      hide: {
        duration: { min: 2, max: 2 },
        onEnter: () => {
          this.play("hide");
          // make it freeze on the last frame and wait for the duration to end
          // and maybe reverse it on exit
        },
        getNext: () => getRandomString(turtleStates),
      },
      lie: {
        duration: { min: 2, max: 2 },
        onEnter: () => {
          this.play("lie");
        },
        getNext: () => "sleep",
      },
      sit: {
        duration: { min: 2, max: 2 },
        onEnter: () => {
          this.play("sit");
        },
        getNext: () => (Math.random() < 0.5 ? "idle" : "hide"),
      },
    });
  }

  protected onTargetReached() {
    this.fsm.transition();
  }
}

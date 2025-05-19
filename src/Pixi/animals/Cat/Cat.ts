import { getRandomString } from "../../../utils/utils.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState, HitBoxConfig } from "../Animal.js";
import { catAnimations } from "./animations.js";

export type CatState = AnimalState | "jump" | "sit" | "run";
const catStates: CatState[] = ["idle", "sleep", "jump", "sit", "run"];

export class Cat extends Animal<CatState> {
  private initialState: CatState = getRandomString(catStates);
  static hitBoxConfig: HitBoxConfig = { w: 0.8, h: 0.8, offsetY: 10 };

  constructor() {
    super({
      width: 32,
      height: 32,
      scale: 2,
      animations: catAnimations,
    });

    this.zIndex = 25;
    this.initStates();
  }

  protected initStates() {
    this.fsm = new StateMachine<CatState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
        },
        getNext: () => getRandomString(catStates),
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
        getNext: () => getRandomString(catStates),
      },
      jump: {
        onEnter: () => {
          this.play("jump");
          this.startMoving(60);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "run"),
      },
      run: {
        onEnter: () => {
          this.play("run");
          this.startMoving(70);
        },
        onExit: () => this.stopMoving(),
        getNext: () => (Math.random() < 0.5 ? "idle" : "sit"),
      },
    });
  }
}

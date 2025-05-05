import { getRandomString } from "../../../../utils/utils.js";
import { viewport } from "../../setup.js";
import { StateMachine } from "../../StateMachine.js";
import { Animal, AnimalState } from "../Animal.js";
import { parrotAnimations } from "./animations.js";

export type ParrotState = AnimalState | "fly" | "sit" | "walk";
const parrotStates: ParrotState[] = ["idle", "sleep", "fly", "sit", "walk"];

export class Parrot extends Animal<ParrotState> {
  private initialState: ParrotState = getRandomString(parrotStates);
  private prevState: ParrotState = "idle"; // next state to go to

  constructor() {
    super({
      width: 16,
      height: 16,
      scale: 2,
      animations: parrotAnimations,
    });

    this.zIndex = 60; // Above trees and other animals
    this.initStates();
  }

  // Make parrot default to flying state more frequently as to not just walk from the tree to the branch
  // Every other should be fly maybe
  protected initStates() {
    this.fsm = new StateMachine<ParrotState>(this.initialState, {
      idle: {
        duration: { min: 2, max: 7 },
        onEnter: () => {
          this.play("idle");
          this.updateStackingOrder(60);
        },
        getNext: () => {
          const nextState = getRandomString(parrotStates);
          if (nextState === "walk" && this.prevState === "fly") {
            const newState = getRandomString(
              parrotStates.filter((s) => s !== "walk")
            );
            this.prevState = newState;
            return newState;
          }

          this.prevState = nextState;
          return nextState;
        },
      },
      sit: {
        duration: { min: 3, max: 7 },
        onEnter: () => {
          this.play("sit");
          this.updateStackingOrder(60);
        },
        getNext: () => {
          const nextState = getRandomString(parrotStates);
          if (nextState === "walk" && this.prevState === "fly") {
            const newState = getRandomString(
              parrotStates.filter((s) => s !== "walk")
            );
            this.prevState = newState;
            return newState;
          }

          this.prevState = nextState;
          return nextState;
        },
      },
      sleep: {
        duration: { min: 30, max: 40 },
        onEnter: () => {
          this.play("sleep");
          this.updateStackingOrder(60);
        },
        getNext: () => {
          this.prevState = "idle";
          return "idle";
        },
      },
      fly: {
        onEnter: () => {
          this.play("fly");
          this.updateStackingOrder(60);
          this.startMoving(120);
        },
        onExit: () => this.stopMoving(),
        getNext: () => {
          this.prevState = Math.random() < 0.5 ? "idle" : "fly";
          return this.prevState;
        },
      },
      walk: {
        onEnter: () => {
          this.play("walk");
          this.startMoving(50);
          this.updateStackingOrder(10);
        },
        onExit: () => this.stopMoving(),
        getNext: () => {
          this.prevState = Math.random() < 0.5 ? "idle" : "fly";
          return this.prevState;
        },
      },
    });
  }
}

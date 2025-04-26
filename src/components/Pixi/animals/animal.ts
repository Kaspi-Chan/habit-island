import {
  Application,
  AnimatedSprite,
  Container,
  Texture,
  ObservablePoint,
  Point,
  Rectangle,
  Ticker,
} from "pixi.js";
import { createAnimatedSprite, createFrames } from "../../../utils/pixi";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../config";
import { getRandomKey, getRandomProperty } from "../../../utils/utils";

interface AnimationConfig {
  assetKey: string;
  frameCount: number;
  animationSpeed?: number;
  scale?: number;
  speed?: number;
}

interface AnimalConfig {
  width: number;
  height: number;
  scale: number;
  animations: Record<string, AnimationConfig>;
}

export type AnimalState = "idle" | "sleep";

export abstract class Animal<
  State extends string = AnimalState
> extends Container {
  public animations: Record<string, AnimatedSprite> = {};
  private currentState: State;

  private target: Point | null = null;
  private speed = 100; // pixels per second
  private bounds!: Rectangle; // area to roam in
  private minInterval = 5; // seconds
  private maxInterval = 10; // seconds
  private stateTimer?: number; // id of the setTimeout for next state
  private moveTimer?: number; // id of the setTimeout for next move

  constructor(cfg: AnimalConfig) {
    super();

    for (const [state, animConfig] of Object.entries(cfg.animations)) {
      this.animations[state] = createAnimatedSprite(
        animConfig.assetKey,
        animConfig.frameCount,
        cfg.width,
        cfg.height,
        0,
        0,
        cfg.scale,
        animConfig.animationSpeed || 1
      );
      this.animations[state].visible = false;
      this.addChild(this.animations[state]);
    }

    // Init animation
    this.currentState = "idle" as State;
    this.animations[this.currentState].visible = true;
    this.animations[this.currentState].play();

    // set random position
    this.position.set(
      Math.random() * (WORLD_WIDTH - 256),
      Math.random() * (WORLD_HEIGHT - 256)
    );
  }

  play(state: State) {
    if (state === this.currentState) return;
    const old = this.animations[this.currentState];
    old.stop();
    old.visible = false;

    const next = this.animations[state];
    if (!next) {
      console.warn(`No animation "${state}" on`, this);
      return;
    }
    next.visible = true;
    next.play();
    this.currentState = state;
  }

  /**
   * Kick off the random-behavior loop.
   * @param roamArea the rectangle the animal is allowed to move in
   */
  public startRandomBehavior(roamArea: Rectangle) {
    this.bounds = roamArea;
    this.scheduleNextState(); // begin cycling states
    Ticker.shared.add(this.moveOnTick, this); // begin moving when needed
  }

  public stopRandomBehavior() {
    clearTimeout(this.stateTimer);
    clearTimeout(this.moveTimer);
    Ticker.shared.remove(this.moveOnTick, this);
    this.target = null;
  }

  public startRandomMovement(
    bounds: Rectangle,
    minInterval = 1,
    maxInterval = 3,
    speed = 120
  ) {
    this.bounds = bounds;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.speed = speed;
    this.scheduleNextMove();
    // Ticker.shared.add(this.moveOnTick, this);
    Ticker.shared.add(this.moveOnTick, this);
  }

  /** stop moving (and cancel future moves) */
  public stopRandomMovement() {
    Ticker.shared.remove(this.moveOnTick, this);
    this.target = null;
  }

  protected scheduleNextState() {
    // prettier-ignore
    const delay = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;

    this.stateTimer = window.setTimeout(() => {
      // play random animation
      const next = getRandomKey(this.animations) as State;
      this.play(next);

      switch (next) {
        case "run":
          this.speed = 120;
          this.pickNewTarget();
          break;
        case "jump":
          this.speed = 80;
          this.pickNewTarget();
          break;
        default:
          clearTimeout(this.moveTimer);
          this.target = null;
          break;
      }

      // then pick another state down the line
      this.scheduleNextState();
    }, delay * 1000);
  }

  private pickNewTarget() {
    const x = this.bounds.x + Math.random() * this.bounds.width;
    const y = this.bounds.y + Math.random() * this.bounds.height;
    this.target = new Point(x, y);

    // set rotation
    this.scale.x = this.x >= x ? -1 : 1;
  }

  private moveOnTick() {
    if (!this.target) return;

    // convert frames to seconds (assumes default 60 FPS)
    const secondsElapsed = Ticker.shared.deltaTime / 60;
    const step = this.speed * secondsElapsed;
    const deltaX = this.target.x - this.x;
    const deltaY = this.target.y - this.y;
    const dist = Math.hypot(deltaX, deltaY);

    // overshot the step
    if (dist < this.speed * secondsElapsed) {
      this.position.set(this.target.x, this.target.y);
      this.target = null;
    } else {
      // move toward it
      this.x += (deltaX / dist) * step;
      this.y += (deltaY / dist) * step;
    }
  }
}

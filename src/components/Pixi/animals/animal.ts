import {
  Assets,
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
import { StateConfig, StateMachine } from "../StateMachine";
import { viewport } from "../setup";

interface AnimationConfig {
  assetKey: string;
  frameCount: number;
  animationSpeed?: number;
  scale?: number;
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
  private static framesCache: Record<string, Texture[]> = {};

  private currentState!: State;
  protected target: Point | null = null;
  protected speed = 100; // pixels per second

  private minInterval = 5; // seconds
  private maxInterval = 10; // seconds
  private stateTimer?: number; // id of the setTimeout for next state
  private bounds = new Rectangle(0, 0, WORLD_WIDTH - 300, WORLD_HEIGHT - 300); // area to roam in

  constructor(cfg: AnimalConfig) {
    super();
    this.init(cfg);
    // this.startRandomBehavior();
    // this.fsm = new StateMachine(initial, stateDefs);
  }

  /**
   * Creates the animated sprites and stores them in the animations object.
   * When called for the first time also slices the png atlas
   * @param cfg The sprites configurations
   */
  private init(cfg: AnimalConfig) {
    const animationCache = (this.constructor as typeof Animal).framesCache;

    for (const [state, animConfig] of Object.entries(cfg.animations)) {
      const key = animConfig.assetKey;

      if (!animationCache[key]) {
        const texture = Assets.get(animConfig.assetKey);
        animationCache[key] = createFrames(
          texture,
          cfg.width,
          cfg.height,
          0,
          0,
          animConfig.frameCount
        );
      }

      const animation = new AnimatedSprite(animationCache[key]);
      animation.animationSpeed = animConfig.animationSpeed || 1;
      animation.scale.set(cfg.scale);
      animation.anchor.set(0.5);
      animation.visible = false;

      this.animations[state] = animation;
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

  protected abstract initStates(): void;

  public play(state: State) {
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

  /** default: do nothing.  Subclasses override */
  // protected abstract onStateChanged(_newState: State): void;

  protected abstract onTargetReached(): void;

  protected startMoving(speed: number) {
    this.pickNewTarget(speed);

    // begin moving when needed
    Ticker.shared.add(this.moveOnTick, this);
  }

  protected stopMoving() {
    this.target = null;
    Ticker.shared.remove(this.moveOnTick, this);
  }

  /** helper for subclasses to ask for a new target */
  private pickNewTarget(speed: number) {
    const x = this.bounds.x + Math.random() * this.bounds.width;
    const y = this.bounds.y + Math.random() * this.bounds.height;
    this.target = new Point(x, y);

    this.speed = speed;
    this.scale.x = this.x >= x ? -1 : 1; // face direction
  }

  protected updateStackingOrder(value: number) {
    this.zIndex = value;
    viewport!.sortChildren();
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
      this.stopMoving();
      this.onTargetReached();
    } else {
      // move toward it
      this.x += (deltaX / dist) * step;
      this.y += (deltaY / dist) * step;
    }
  }
}

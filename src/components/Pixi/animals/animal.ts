import {
  Assets,
  AnimatedSprite,
  Container,
  Texture,
  Point,
  Rectangle,
  Ticker,
  Graphics,
} from "pixi.js";
import {
  createFrames,
  debugHitArea,
  getAbsoluteCords,
} from "../../../utils/pixi";
import { TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config";
import { staticObsticles, viewport } from "../setup";
import { StateMachine } from "../StateMachine";

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

const dynamicObstacles: Animal<any>[] = [];

export abstract class Animal<
  State extends string = AnimalState
> extends Container {
  public animations: Record<string, AnimatedSprite> = {};
  private static framesCache: Record<string, Texture[]> = {};
  protected static hitAreaScale = { w: 1, h: 1 };
  private hitbox = new Rectangle(0, 0, 0, 0);

  private currentState!: State;
  protected target: Point | null = null;
  protected speed = 100; // pixels per second
  protected fsm!: StateMachine<State>;

  private debugLayer = new Graphics();
  private bounds = new Rectangle(0, 0, WORLD_WIDTH - 300, WORLD_HEIGHT - 300); // area to roam in

  constructor(cfg: AnimalConfig) {
    super();
    this.init(cfg);
    this.createHitBox();
    viewport!.addChild(this.debugLayer);
    this.debugLayer.zIndex = 1000; // above everything else
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
    const { x, y } = this.pickStartingPoint();
    this.position.set(x, y);
  }

  protected abstract initStates(): void;

  private pickStartingPoint() {
    let x = 0;
    let y = 0;

    do {
      x = Math.random() * (WORLD_WIDTH - 256);
      y = Math.random() * (WORLD_HEIGHT - 256);
    } while (!this.isValidStartingPoint(x, y));

    return { x, y };
  }

  private isValidStartingPoint(px: number, py: number): boolean {
    const isInStaticObstacle = staticObsticles.some((r) => r.contains(px, py));
    const isInDynamicObstacle = dynamicObstacles.some((container) => {
      const { x, y, width, height } = getAbsoluteCords(
        container.hitbox,
        container
      );
      return px >= x && px <= x + width && py >= y && py <= y + height;
    });
    return !isInStaticObstacle && !isInDynamicObstacle;
  }

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

  protected updateStackingOrder(value: number) {
    this.zIndex = value;
    viewport!.sortChildren();
  }

  protected onObstacleHit() {
    this.debugLayer.clear();
    this.pickNewTarget(this.speed);
  }

  protected startMoving(speed: number) {
    this.pickNewTarget(speed);
    // Start ticker
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
    this.scale.x = this.x >= this.target!.x ? -1 : 1; // face direction

    // debug
    this.drawDebugPath();
  }

  private moveOnTick() {
    if (!this.target) return;

    // convert frames to seconds (assumes default 60 FPS)
    const secondsElapsed =
      (Ticker.shared.elapsedMS / 1000) * Ticker.shared.speed;
    const step = this.speed * secondsElapsed;
    const deltaX = this.target.x - this.x;
    const deltaY = this.target.y - this.y;
    const dist = Math.hypot(deltaX, deltaY);

    // save current position
    const currX = this.x;
    const currY = this.y;

    // get next position
    let nextX = this.x + (deltaX / dist) * step;
    let nextY = this.y + (deltaY / dist) * step;

    // snap to target if close enough
    if (dist <= step) {
      nextX = this.target.x;
      nextY = this.target.y;
      this.onTargetReached();
    }

    // static obstacles - trees, rocks, etc.
    for (const r of staticObsticles) {
      if (r.contains(nextX, nextY)) {
        return this.pickNewTarget(this.speed);
      }
    }

    // Move
    this.x = nextX;
    this.y = nextY;

    // // dynamic obstacles - other animals
    for (const o of dynamicObstacles) {
      if (o === this) continue; // skip self

      if (this.intersects(o)) {
        // move back to previous position
        this.x = currX;
        this.y = currY;
        return this.pickNewTarget(this.speed);
      }
    }
  }

  private intersects(obstacle: Animal): boolean {
    const a = getAbsoluteCords(this.hitbox, this);
    const b = getAbsoluteCords(obstacle.hitbox, obstacle);

    return !(
      a.x + a.width <= b.x ||
      a.x >= b.x + b.width ||
      a.y + a.height <= b.y ||
      a.y >= b.y + b.height
    );
  }

  protected onTargetReached() {
    this.debugLayer.clear();
    this.fsm.goNext();
  }

  private createHitBox() {
    const { w, h } = (this.constructor as typeof Animal).hitAreaScale;

    const width = this.width * w;
    const height = this.height * h;

    const animalRect = new Rectangle(
      -width * 0.5,
      -height * 0.5,
      width,
      height
    );

    this.hitbox = animalRect;
    dynamicObstacles.push(this);

    this.addChild(debugHitArea(this.hitbox, 0x00ff00, 0.3)!);
  }

  private drawDebugPath() {
    const g = this.debugLayer;
    g.clear();

    // if (this.path.length === 0) return;

    // draw each waypoint as a small white dot
    // for (const pt of this.path) {
    //   g.circle(pt.x, pt.y, 4);
    //   g.fill(0xffffff);
    // }

    // mark start (first) in green
    const start = this.position;
    g.circle(start.x, start.y, 6);
    g.fill(0x00ff00);

    // mark end (last) in red
    const end = this.target;
    g.circle(end!.x, end!.y, 6);
    g.fill(0xff0000);
  }
}

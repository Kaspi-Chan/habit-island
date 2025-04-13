import * as PIXI from "pixi.js";

// Define the possible states for the rabbit.
type AnimalState = "idle" | "walking";

// Utility function to get a random number between min and max.
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

class Animal {
  sprite: PIXI.AnimatedSprite;
  state: AnimalState = "idle";
  targetPos: PIXI.Point = new PIXI.Point();
  speed: number;
  worldWidth: number;
  worldHeight: number;

  constructor(
    sprite: PIXI.AnimatedSprite,
    worldWidth: number,
    worldHeight: number,
    speed: number = 2
  ) {
    this.sprite = sprite;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.speed = speed;
    // Start the behavior cycle.
    this.scheduleNextAction();
  }

  // Schedule the next state change using a randomized delay.
  scheduleNextAction() {
    const delay = randomBetween(1000, 3000); // milliseconds between state changes
    setTimeout(() => {
      this.chooseNextAction();
    }, delay);
  }

  // Decide what to do next based on the current state.
  chooseNextAction() {
    if (this.state === "idle") {
      // From idle, decide to walk.
      this.startWalking();
    } else {
      // If currently walking, switch to idle.
      this.state = "idle";
      this.sprite.gotoAndStop(0); // Reset to idle frame or first frame of idle animation.
      // Optionally, you might have an idle animation so you could call play() instead.
    }
    // Schedule the next action regardless.
    this.scheduleNextAction();
  }

  // Set a target within the world bounds and start walking.
  startWalking() {
    this.state = "walking";
    // Pick a random target within the world bounds.
    // Adjust these calculations to leave some margin if needed.
    this.targetPos.x = randomBetween(0, this.worldWidth - this.sprite.width);
    this.targetPos.y = randomBetween(0, this.worldHeight - this.sprite.height);
    // Change animation to walking animation (if using multiple animations in your sprite sheet).
    // For example, if you have multiple animations, switch to the proper textures here.
    this.sprite.play(); // Assuming that .play() triggers the walking animation.
    // Optionally, flip the sprite horizontally based on movement direction:
    if (this.targetPos.x < this.sprite.x) {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    } else {
      this.sprite.scale.x = Math.abs(this.sprite.scale.x);
    }
  }

  // Call this from your main PIXI update/ticker loop with the delta time.
  update(delta: number) {
    if (this.state === "walking") {
      // Calculate the distance to the target.
      const dx = this.targetPos.x - this.sprite.x;
      const dy = this.targetPos.y - this.sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1) {
        // Reached the target, transition to idle.
        this.state = "idle";
        this.sprite.gotoAndStop(0);
      } else {
        // Normalize movement vector for smooth movement.
        const moveX = (dx / distance) * this.speed * delta;
        const moveY = (dy / distance) * this.speed * delta;
        this.sprite.x += moveX;
        this.sprite.y += moveY;
      }
    }
  }
}

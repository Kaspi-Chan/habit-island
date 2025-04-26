import { onMount, onCleanup, createSignal } from "solid-js";
import {
  Application,
  Graphics,
  Text,
  Sprite,
  Assets,
  Spritesheet,
  AnimatedSprite,
  TextureSource,
  Ticker,
  Container,
  Point,
  Texture,
  Rectangle,
} from "pixi.js";
import { Viewport } from "pixi-viewport";
import { initDevtools } from "@pixi/devtools";
import { populateWithTrees } from "./foliage/trees.js";
import { init } from "./setup.js";
import { Bunny } from "./animals/Bunny/Bunny.js";
import { AnimalState } from "./animals/Animal.js";

interface ParrotSprite extends AnimatedSprite {
  direction?: number;
}

function PixiComponent() {
  let container; // Reference to the container div

  const initParrot = async (viewport: Viewport) => {
    const atlasData = {
      frames: {
        fly1: {
          frame: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly2: {
          frame: { x: 16, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly3: {
          frame: { x: 32, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly4: {
          frame: { x: 48, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly5: {
          frame: { x: 64, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly6: {
          frame: { x: 80, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly7: {
          frame: { x: 96, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
        fly8: {
          frame: { x: 112, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
        },
      },
      meta: {
        image: "/animals/ParrotFly.png",
        size: { w: 128, h: 16 },
        scale: "1",
      },
      animations: {
        fly: ["fly1", "fly2", "fly3", "fly4", "fly5", "fly6", "fly7", "fly8"],
      },
      scale: 1,
    };

    const texture = Assets.get("parrot");
    // texture.baseTexture.scaleMode = "nearest";
    const spriteSheet = new Spritesheet(texture, atlasData);
    await spriteSheet.parse();
    const animatedSprite = new AnimatedSprite(
      spriteSheet.animations.fly
    ) as ParrotSprite;

    const pixiContainer = new Container();
    pixiContainer.addChild(animatedSprite);
    viewport.addChild(pixiContainer);

    animatedSprite.play();
    animatedSprite.animationSpeed = 0.1;
    animatedSprite.scale.set(3);
    animatedSprite.position.set(300, 300);
    animatedSprite.anchor.set(0.5);

    return animatedSprite;
  };

  const animateParrot = (
    app: Application,
    timer: Ticker,
    parrot: ParrotSprite
  ) => {
    const baseY = 100; // The midpoint where the parrot hovers
    const amplitude = 20; // The maximum offset from the base (range will be baseY ± amplitude)

    if (parrot.direction === undefined) {
      parrot.direction = 1; // Initialize direction
    }

    if (parrot.x >= app.screen.width) {
      parrot.x = app.screen.width;
      parrot.direction = -1;
      parrot.scale.x = -3;
    } else if (parrot.x <= 0) {
      parrot.x = 0;
      parrot.direction = 1;
      parrot.scale.x = 3;
    }

    parrot.x += parrot.direction;
    parrot.y = baseY + Math.sin(timer.elapsedMS / 1000) * amplitude;
  };

  onMount(() => {
    (async () => {
      const { app, viewport } = await init(container!);

      // parrot
      const parrot = await initParrot(viewport);
      app.ticker.add((ticker) => animateParrot(app, ticker, parrot));

      const roamArea = new Rectangle(
        0,
        0,
        viewport.worldWidth,
        viewport.worldHeight
      );

      const bunny1 = new Bunny();
      const bunny2 = new Bunny();
      const bunny3 = new Bunny();
      const bunny4 = new Bunny();
      const bunny5 = new Bunny();

      bunny1.startRandomBehavior(roamArea);
      bunny2.startRandomBehavior(roamArea);
      bunny3.startRandomBehavior(roamArea);
      bunny4.startRandomBehavior(roamArea);
      bunny5.startRandomBehavior(roamArea);

      viewport.addChild(bunny1);
      viewport.addChild(bunny2);
      viewport.addChild(bunny3);
      viewport.addChild(bunny4);
      viewport.addChild(bunny5);

      populateWithTrees(viewport);
      initDevtools({ app });
      container!.appendChild(app.canvas);
    })();
  });

  return (
    <div class="w-full h-full max-w-[1440px] mx-auto" ref={container}></div>
  );
}

export default PixiComponent;

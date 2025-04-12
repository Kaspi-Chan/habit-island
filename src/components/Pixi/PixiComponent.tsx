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
} from "pixi.js";
import { Viewport } from "pixi-viewport";
import { initDevtools } from "@pixi/devtools";
import { addBunny, animateBunny } from "./animals/bunny/bunny.js";
import { Bunny } from "./animals/bunny/BunnyClass.js";
import { populateWithTrees } from "./foliage/trees/trees.js";

interface ParrotSprite extends AnimatedSprite {
  direction?: number;
}

function PixiComponent() {
  let container; // Reference to the container div

  const addBackground = (app: Application) => {
    const background = Sprite.from("backgroundNoTrees2");

    background.anchor.set(0);
    background.x = 0;
    background.y = 0;
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.scale.set(3);

    app.stage.addChild(background);

    return background;
  };

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
    viewport.addChild(animatedSprite);

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

  const preload = async () => {
    const assets = [
      { alias: "background", src: "tiles/island-bg.png" },
      { alias: "backgroundNoTrees", src: "tiles/bg-no-trees.png" },
      { alias: "backgroundNoTrees2", src: "tiles/bg-no-trees2.png" },
      { alias: "tree", src: "trees/Autumn.png" },
      { alias: "parrot", src: "animals/ParrotFly.png" },
      { alias: "bunnyJump", src: "animals/BunnyJump.png" },
      { alias: "bunnySleep", src: "animals/BunnySleep.png" },
      { alias: "treeGreen", src: "trees/AnimatedTreeCoolColor.png" },
    ];

    await Assets.load(assets);
  };

  const setup = async (app: Application) => {
    await app.init({
      resizeTo: container,
      backgroundColor: "#000333",
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
  };

  onMount(() => {
    (async () => {
      const app = new Application();
      TextureSource.defaultOptions.scaleMode = "nearest";

      await setup(app);
      await preload();

      const tilemapSprite = addBackground(app);

      const viewport = new Viewport({
        screenWidth: container!.clientWidth,
        screenHeight: container!.clientHeight,
        worldWidth: tilemapSprite.width,
        worldHeight: tilemapSprite.height,
        events: app.renderer.events,
      });
      viewport.addChild(tilemapSprite);
      viewport.clampZoom({
        minWidth: viewport.worldWidth / 3,
        maxWidth: viewport.worldWidth,
        minHeight: viewport.worldHeight / 3,
        maxHeight: viewport.worldHeight,
      });
      app.stage.addChild(viewport);
      viewport.drag().pinch().wheel().decelerate();
      viewport.clamp({ direction: "all" });

      // parrot
      const parrot = await initParrot(viewport);
      app.ticker.add((ticker) => animateParrot(app, ticker, parrot));

      // bunny
      const bunny = await addBunny(viewport);
      app.ticker.add(() => animateBunny(app, bunny));

      populateWithTrees(viewport);

      // class
      const BunnyClass = new Bunny();
      BunnyClass.init({
        x: 100,
        y: 550,
        scale: { x: 2, y: 2 },
        anchor: { x: 0.5, y: 0.5 },
      });

      await BunnyClass.defineAnimationFromURL(
        "jump",
        "bunnyJump",
        0,
        0,
        11,
        32,
        32
      );

      await BunnyClass.defineAnimationFromURL(
        "sleep",
        "bunnySleep",
        0,
        0,
        6,
        32,
        32
      );
      BunnyClass.play("jump");

      BunnyClass.clickToToggle();
      app.ticker.add(() => animateBunny(app, BunnyClass));

      viewport.addChild(BunnyClass);

      initDevtools({ app });
      container!.appendChild(app.canvas);
    })();
  });

  return (
    <div class="w-full h-full max-w-[1440px] mx-auto" ref={container}></div>
  );
}

export default PixiComponent;

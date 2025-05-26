import { onMount, createEffect, on, createSignal } from "solid-js";
import { initDevtools } from "@pixi/devtools";
import { populateWithTrees } from "../Pixi/foliage/trees.js";
import { init, viewport } from "../Pixi/setup.js";
import { debugHitArea } from "../utils/pixi/index.js";
import { populateWithFoliage } from "../Pixi/foliage/foliage.js";
import { Capybara } from "../Pixi/animals/Capybara/Capybara.js";
import { Bunny } from "../Pixi/animals/Bunny/Bunny.js";
import { Fox } from "../Pixi/animals/Fox/Fox.js";
import { Parrot } from "../Pixi/animals/Parrot/Parrot.js";
import { Cat } from "../Pixi/animals/Cat/Cat.js";
import { Turtle } from "../Pixi/animals/Turtle/Turtle.js";
import { addWaterTiles } from "../Pixi/foliage/water.js";
import { userInfo } from "./store/userStore.js";
import { Container, Ticker } from "pixi.js";

function Island() {
  let container; // Reference to the container div
  const [pixiLoaded, setPixiLoaded] = createSignal(false);
  const renderedAnimals = new Set<string>();
  const animalContainer = new Container();

  onMount(() => {
    (async () => {
      const { app, viewport } = await init(container!);
      viewport.addChild(populateWithTrees());
      viewport.addChild(populateWithFoliage());
      viewport.addChild(addWaterTiles());

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          Ticker.shared.stop();
        } else {
          Ticker.shared.start();
        }
      });

      // staticObstacles.forEach((obsticle) =>
      //   viewport.addChild(debugHitArea(obsticle, 0x00ff00, 0.3)!)
      // );

      viewport.addChild(animalContainer);

      initDevtools({ app });
      container!.appendChild(app.canvas);
      setPixiLoaded(true);
    })();
  });

  createEffect(() => {
    if (!pixiLoaded()) return;

    userInfo.animals?.forEach((animal) => {
      if (renderedAnimals.has(animal.name)) return;

      let animInstance;
      switch (animal.type) {
        case "Bunny":
          animInstance = new Bunny();
          break;
        case "Capybara":
          animInstance = new Capybara();
          break;
        case "Fox":
          animInstance = new Fox();
          break;
        case "Cat":
          animInstance = new Cat();
          break;
        case "Turtle":
          animInstance = new Turtle();
          break;
        case "Parrot":
          animInstance = new Parrot();
          break;
      }

      if (animInstance && viewport) {
        renderedAnimals.add(animal.name);
        animalContainer.addChild(animInstance);
      }
    });
  });

  // Reset animals on new login
  createEffect(
    on(
      () => userInfo.id,
      (newId, prevId) => {
        if (!pixiLoaded()) return;

        if (newId && newId !== prevId) {
          renderedAnimals.clear();
          if (animalContainer) {
            animalContainer.removeChildren();
          }
        }
      }
    )
  );

  return (
    <div class="flex justify-center items-center w-full h-6/12 lg:h-full flex-1 ">
      <div class="w-full h-full max-w-[1440px] mx-auto" ref={container}></div>
    </div>
  );
}

export default Island;

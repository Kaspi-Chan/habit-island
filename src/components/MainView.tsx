import { Portal } from "solid-js/web";
import SkillBars from "./tasks/SkillBars.jsx";
import TasksList from "./tasks/TasksList.jsx";
import Toast from "./misc/Toast.jsx";
import AnimalCatalogue from "./AnimalCatalogue/AnimalCatalogue.jsx";
import { createEffect, createMemo, onMount } from "solid-js";
import { setShowStatus, userInfo } from "./store/userStore.js";

const MainView = () => {
  let modalEl: HTMLDialogElement;
  onMount(() => {
    modalEl = document.getElementById(
      "animal-catalogue-modal"
    ) as HTMLDialogElement;
  });

  createEffect(() => {
    const animals = userInfo.animals;
    if (animals === null) return;

    const lvl = userInfo.level;
    const have = animals.length;
    const need = Math.floor(lvl / 5) + 1;

    if (have < need && modalEl && !modalEl.open) {
      modalEl.showModal();
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  });

  return (
    <div
      class="lg:max-w-[400px] 2xl:max-w-lg lg:py-16 mt-6 mx-auto 
      w-[95%] lg:min-h-[100vh] flex flex-col">
      <SkillBars />
      <TasksList />
      <Portal>
        <Toast />
      </Portal>
      <AnimalCatalogue />
    </div>
  );
};

export default MainView;

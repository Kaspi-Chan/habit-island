import { createSignal, For, Show } from "solid-js";
import ProgressBar from "./ProgressBar.jsx";
import { setUserInfo, userInfo } from "../store/userStore.js";
import PlusIconBtn from "../misc/PlusIconBtn.jsx";
import { addSkill } from "../../firebase/firestore.js";
import { showToast } from "../store/toastStore.js";
import { Skill } from "../../types/index.js";

const SkillBars = () => {
  let inputRef: HTMLInputElement;
  const [toggleBtn, setToggleBtn] = createSignal(false);
  const [skillTitle, setSkillTitle] = createSignal("");

  const handleNewSkill = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!toggleBtn()) setToggleBtn(true);
    inputRef!.focus();

    if (skillTitle() === "") return;

    const newSkill: Skill = {
      name: skillTitle(),
      currentXP: 0,
      level: 1,
    };

    try {
      await addSkill(userInfo.id, newSkill);
      showToast(`Skill added successfully !`);
    } catch (error) {
      showToast(`An error occured!`, 3000, "error");
      console.error(error);
    }
    reset();
  };

  const reset = () => {
    setSkillTitle("");
    setToggleBtn(false);
  };

  return (
    <div class="collapse bg-base-200 border-2 border-accent ">
      <input onClick={reset} type="checkbox" />
      <div class="collapse-title flex pr-0">
        <ProgressBar
          label={"XP"}
          progress={userInfo.xp}
          level={userInfo.level}
        />
        <button class="btn btn-info btn-soft ml-2 mr-4 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="collapse-content text-sm">
        <For each={userInfo.skills}>
          {(skill) => (
            <ProgressBar
              label={skill.name}
              progress={skill.currentXP}
              level={skill.level}
            />
          )}
        </For>
        <Show when={userInfo.skills.length < 10}>
          <form onSubmit={handleNewSkill}>
            <Show when={!toggleBtn()}>
              <PlusIconBtn class="pl-0 w-full flex items-center justify-start gap-4 mt-2">
                <span>Add new skill</span>
              </PlusIconBtn>
            </Show>
            <Show when={toggleBtn()}>
              <div class="flex items-center justify-start mt-4">
                <PlusIconBtn class="pl-0" />
                <input
                  ref={inputRef!}
                  type="text"
                  value={skillTitle()}
                  onInput={(e) => setSkillTitle(e.currentTarget.value)}
                  class="input input-ghost w-full"
                  placeholder="Spanish proficiency"
                  required
                />
              </div>
            </Show>
          </form>
        </Show>
      </div>
    </div>
  );
};

export default SkillBars;

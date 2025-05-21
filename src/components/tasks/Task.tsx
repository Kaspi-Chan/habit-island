import { For } from "solid-js";
import { completeTaskAndAwardXp, removeTask } from "../../firebase/firestore";
import { userInfo, type Task } from "../store/userStore";

const Task = (props: Task) => {
  const handleTaskComplete = async () => {
    await completeTaskAndAwardXp(userInfo.id, props.categories, props.xp);
    removeTask(userInfo.id, props.id);
  };

  return (
    <li class="list-row items-center bg-base-100">
      <div class="list-col-grow flex flex-col gap-2">
        <span class="text-base">{props.title}</span>
        <div class="flex gap-1">
          <For each={props.categories}>
            {(category) => (
              <div class="badge badge-soft badge-info">{category}</div>
            )}
          </For>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          checked
          class="checkbox rounded-md checkbox-primary"
          onclick={handleTaskComplete}
        />
      </div>
    </li>
  );
};

export default Task;

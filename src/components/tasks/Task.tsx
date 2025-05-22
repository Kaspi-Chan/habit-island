import { For } from "solid-js";
import { completeTaskAndAwardXp, removeTask } from "../../firebase/firestore";
import { userInfo, type Task } from "../store/userStore";
import { Timestamp } from "firebase/firestore";
import { COLORS } from "../../config";

const Task = (props: Task) => {
  const handleTaskComplete = async () => {
    // toast
    await completeTaskAndAwardXp(userInfo.id, props);
  };

  const date = (props.dueDate as Timestamp)
    .toDate()
    .toISOString()
    .split("T")[0];

  return (
    <li class="list-row items-center bg-base-100 mx-2">
      <div class="list-col-grow flex flex-col gap-2">
        <span class="text-base">{props.title}</span>
        <div class="flex gap-1 flex-wrap">
          <For each={props.categories}>
            {(category) => (
              <div
                class={`badge badge-soft ${
                  COLORS[category] ?? "custom-skill"
                } text-xs sm:text-sm`}>
                {category}
              </div>
            )}
          </For>
          <div
            class={`badge badge-soft text-xs sm:text-sm ${
              props.overdue ? "badge-error" : ""
            }`}>
            {date}
          </div>
          <div class="badge badge-soft badge-warning text-xs sm:text-sm pl-1.5 gap-0.5">
            <span>⚡</span>
            <span>{props.xp}</span>
          </div>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          checked={true}
          class="checkbox rounded-md checkbox-primary"
          onclick={handleTaskComplete}
        />
      </div>
    </li>
  );
};

export default Task;

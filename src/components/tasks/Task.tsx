import { For } from "solid-js";
import { completeTaskAndAwardXp, removeTask } from "../../firebase/firestore";
import { setTaskToEdit, userInfo, type Task } from "../store/userStore";
import { Timestamp } from "firebase/firestore";
import { COLORS } from "../../config";

const Task = (props: Task) => {
  const handleTaskComplete = async (e: MouseEvent) => {
    e.stopPropagation();
    // toast
    await completeTaskAndAwardXp(userInfo.id, props);
  };

  const handleTaskEdit = () => {
    setTaskToEdit({ ...props });
    const editTaskModal = document.getElementById(
      "edit-task-modal"
    ) as HTMLDialogElement;

    editTaskModal.show();
  };

  const date = (props.dueDate as Timestamp)
    .toDate()
    .toISOString()
    .split("T")[0];

  return (
    <li
      onClick={handleTaskEdit}
      class="list-row items-center bg-base-100 mx-2 cursor-pointer">
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
        <button
          onclick={handleTaskComplete}
          class="btn btn-soft px-2 rounded-md btn-square btn-primary">
          <svg
            fill="currentColor"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-[1.2em]"
            viewBox="0 0 45.701 45.7">
            <g>
              <g>
                <path
                  d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504
			c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0
			c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z"
                />
              </g>
            </g>
          </svg>
        </button>
      </div>
    </li>
  );
};

export default Task;

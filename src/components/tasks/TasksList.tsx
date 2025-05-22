import { createEffect, createSignal, For, Show } from "solid-js";
import CalendarPicker from "../misc/CalendarPicker.jsx";
import NewTaskBtn from "./NewTaskBtn.jsx";
import Task from "./Task.jsx";
import { userInfo } from "../store/userStore.js";
import { Timestamp } from "firebase/firestore";
import { getDay } from "../../utils/utils.js";
import PlusIconBtn from "../misc/PlusIconBtn.jsx";

const TasksList = () => {
  const [todayTasks, setTodayTasks] = createSignal<typeof userInfo.tasks>();
  const [otherTasks, setOtherTasks] = createSignal<typeof userInfo.tasks>();
  createEffect(() => {
    // 1) compute today’s bounds in local time
    const start = getDay(0); // today
    const end = getDay(1); // tomorrow

    // 2) filter
    const todays: typeof userInfo.tasks = [];
    const rest: typeof userInfo.tasks = [];

    for (const task of userInfo.tasks) {
      const dueDate: Date = task.dueDate.toDate();
      if (dueDate < end) {
        todays.push(task);
      } else {
        rest.push(task);
      }
    }

    // 3) update your signal
    setTodayTasks(todays);
    setOtherTasks(rest);
  });

  return (
    <ul class="list bg-base-300 rounded-box shadow-md w-full gap-2 pb-8 relative top-4 overflow-y-scroll border-2 border-primary flex-1">
      <li class="p-4 pb-2 text-lg tracking-wide">Daily Tasks</li>
      <li class="list-row grid-cols-none bg-base-100 mx-2">
        <NewTaskBtn />
      </li>
      <For each={todayTasks()}>{(task) => <Task {...task} />}</For>
      <Show when={todayTasks()?.length === 0}>
        <li class="p-4 pb-2 mx-auto">
          Great job! No tasks left for today! 🎉🎉🎉
        </li>
      </Show>
      <li class="p-4 pb-2 text-lg tracking-wide">Other Tasks</li>
      <For each={otherTasks()}>{(task) => <Task {...task} />}</For>
    </ul>
  );
};

export default TasksList;

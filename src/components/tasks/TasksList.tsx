import { For } from "solid-js";
import CalendarPicker from "../misc/CalendarPicker.jsx";
import NewTaskBtn from "./NewTaskBtn.jsx";
import Task from "./Task.jsx";
import { userInfo } from "../store/userStore.js";

const TasksList = () => {
  return (
    <ul class="list bg-base-300 rounded-box shadow-md w-full gap-2 pb-8 relative top-4 overflow-y-scroll border-2 border-primary flex-1">
      <li class="p-4 pb-2 text-lg tracking-wide">Daily Tasks</li>
      <li class="list-row items-center bg-base-100">
        <NewTaskBtn />
        <span>Add new goal</span>
      </li>
      <For each={userInfo.tasks}>
        {(task) => (
          <Task
            id={task.id}
            title={task.title}
            categories={task.categories}
            dueDate={task.dueDate}
            xp={task.xp}
          />
        )}
      </For>
    </ul>
  );
};

export default TasksList;

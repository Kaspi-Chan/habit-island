import {
  Accessor,
  createEffect,
  createSignal,
  For,
  Show,
  splitProps,
} from "solid-js";
import FormModal from "../misc/FormModal";
import {
  addTask,
  completeTaskAndAwardXp,
  editTask,
  removeTask,
} from "../../firebase/firestore";
import {
  motivation,
  periodAmount,
  periodKind,
  setTaskToEdit,
  Task,
  userInfo,
} from "../store/userStore";
import { formatDateForInput } from "../../utils/utils";
import Rating from "../misc/Rating";
import { COLORS } from "../../config";
import PlusIconBtn from "../misc/PlusIconBtn";
import { Timestamp } from "firebase/firestore";

interface props {
  task: Task;
}

const EditTaskModal = (props: props) => {
  const { title, dueDate, motivation, repeat, repeatPeriod, categories } =
    props.task;
  const [newTitle, setNewTitle] = createSignal(title);
  const [date, setDate] = createSignal(formatDateForInput(dueDate.toDate()));
  const [newRepeat, setNewRepeat] = createSignal(repeat);
  const [newMotivation, setNewMotivation] =
    createSignal<motivation>(motivation);
  const [amount, setAmount] = createSignal<periodAmount>(
    repeatPeriod?.amount || "1"
  );
  const [kind, setKind] = createSignal<periodKind>(
    repeatPeriod?.kind || "days"
  );

  const [taskCategories, setTaskCategories] = createSignal(categories);
  const [unselectedCategories, setUnselectedCategories] = createSignal<
    string[]
  >([]);

  createEffect(() => {
    const selected = taskCategories();
    const unselected = userInfo.skills
      .filter((skill) => !selected.includes(skill.name))
      .map((skill) => skill.name);

    setUnselectedCategories(unselected);
  });

  const handleAddCategory = (name: string) => {
    setTaskCategories((prev) => [...prev, name]);
  };

  const handleRemoveCategory = (name: string) => {
    if (taskCategories().length === 1) return; // toast here

    setTaskCategories((prev) => prev.filter((category) => category !== name));
  };

  const handleEditTask = async (modal: HTMLDialogElement) => {
    // if user motivation changed re-evaluateval xp
    const reEvalXp = props.task.motivation !== newMotivation();

    try {
      await editTask(userInfo.id, reEvalXp, {
        title: newTitle(),
        id: props.task.id,
        xp: props.task.xp,
        categories: taskCategories(),
        dueDate: Timestamp.fromDate(new Date(date())),
        motivation: newMotivation(),
        repeat: newRepeat(),
        repeatPeriod: { amount: amount(), kind: kind() },
      });
    } catch (error) {
      return error as string;
    }
    modal.close();
    handleReset();
  };

  const handleCompleteTask = async () => {
    await completeTaskAndAwardXp(userInfo.id, props.task);
    handleReset();
  };

  const handleRemoveTask = async () => {
    await removeTask(userInfo.id, props.task.id);
    handleReset();
  };

  const handleReset = () => {
    setTaskToEdit(null);
  };

  return (
    <FormModal
      id="edit-task-modal"
      title="Edit goal"
      buttonText="Edit goal"
      onReset={handleReset}
      onSubmit={handleEditTask}>
      <div class="space-y-3 flex flex-col ">
        <div class="flex flex-col justify-center items-center">
          <label class="floating-label w-full">
            <span>Goal title</span>
            <input
              type="text"
              placeholder="Goal title"
              class="input input-md input-neutral w-full"
              value={newTitle()}
              onInput={(e) => setNewTitle(e.currentTarget.value)}
              required
            />
          </label>
        </div>
        <div class="flex flex-wrap items-center gap-1">
          <For each={taskCategories()}>
            {(category) => (
              <div
                class={`badge badge-soft badge-sm mt-0.5 relative cursor-pointer pr-4 group ${
                  COLORS[category] ?? "custom-skill"
                } text-xs`}>
                <span>{category}</span>
                <div
                  onClick={() => handleRemoveCategory(category)}
                  class="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-3 -top-3 w-10 h-10 grid place-items-center btn-square z-10">
                  x
                </div>
              </div>
            )}
          </For>
          <Show when={taskCategories().length < 3}>
            <div class="dropdown dropdown-center">
              <PlusIconBtn
                class="px-2 h-5"
                click={(e) => {
                  e.preventDefault();
                }}
              />
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-box z-1 w-40">
                <For each={unselectedCategories()}>
                  {(category) => (
                    <li
                      tabIndex={0}
                      class="text-xs"
                      onClick={() => handleAddCategory(category)}>
                      <a>{category}</a>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </Show>
        </div>
        <label class="input input-neutral w-full">
          <span class="label mb-0">Due Date</span>
          <input
            type="date"
            disabled={newRepeat()}
            class="block"
            value={date()}
            onInput={(e) => setDate(e.currentTarget.value)}
          />
        </label>
        <div class="flex gap-4">
          <label class="label mb-0">Repeat: </label>
          <input
            type="checkbox"
            checked={newRepeat()}
            class="toggle toggle-neutral"
            onInput={() => setNewRepeat((prev) => !prev)}
          />
        </div>
        <Show when={newRepeat()}>
          <div class="flex gap-6">
            <label class="label">Every:</label>
            <div class="flex gap-2 w-full">
              <select
                value={amount()}
                onInput={(e) =>
                  setAmount(e.currentTarget.value as unknown as periodAmount)
                }
                class="select select-neutral flex-1/4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
              <select
                value={kind()}
                onInput={(e) =>
                  setKind(e.currentTarget.value as unknown as periodKind)
                }
                class="select select-neutral">
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
                <option value="years">years</option>
              </select>
            </div>
          </div>
          <label class="input input-neutral w-full">
            <span class="label mb-0">Starting</span>
            <input
              type="date"
              class="block"
              value={date()}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </label>
        </Show>
        <div class="flex gap-4">
          <label class="label">Motivation:</label>
          <Rating motivation={newMotivation} setMotivation={setNewMotivation} />
        </div>
        <div class="flex gap-2 w-full">
          <button
            onClick={handleCompleteTask}
            class="btn btn-soft btn-success flex-1">
            Mark as complete
          </button>
          <button
            onClick={handleRemoveTask}
            class="btn btn-soft btn-error flex-1">
            Remove goal
          </button>
        </div>
      </div>
    </FormModal>
  );
};

export default EditTaskModal;

import { createSignal, For, Show } from "solid-js";
import FormModal from "../misc/FormModal";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { addTask } from "../../firebase/firestore";
import {
  motivation,
  periodAmount,
  periodKind,
  repeatPeriod,
  userInfo,
} from "../store/userStore";

const NewTaskModal = () => {
  const today = () => new Date().toISOString().split("T")[0];
  const [title, setTitle] = createSignal("");
  const [date, setDate] = createSignal(today());
  const [motivation, setMotivation] = createSignal<motivation>(3);
  const [repeat, setRepeat] = createSignal(false);
  const [amount, setAmount] = createSignal<periodAmount>("1");
  const [kind, setKind] = createSignal<periodKind>("days");
  let calendarRef: HTMLInputElement;
  let repeatCalendarRef: HTMLInputElement;

  const handleNewTask = async (modal: HTMLDialogElement) => {
    try {
      await addTask(userInfo.id, {
        title: title(),
        dueDate: new Date(date()),
        motivation: motivation(),
        repeat: repeat(),
        repeatPeriod: { amount: amount(), kind: kind() },
      });
    } catch (error) {
      console.log(error);
    }
    modal.close();
  };

  const handleReset = () => {
    if (calendarRef!) {
      calendarRef.value = date();
    }

    if (repeatCalendarRef!) {
      repeatCalendarRef.value = date();
    }

    setRepeat(false);
  };

  return (
    <FormModal
      id="new-task-modal"
      title="Create new goal"
      buttonText="Set goal"
      onReset={handleReset}
      onSubmit={handleNewTask}>
      <div class="space-y-3 flex flex-col ">
        <div class="flex flex-col justify-center items-center">
          <label class="floating-label w-full">
            <span>Goal title</span>
            <input
              type="text"
              placeholder="Goal title"
              class="input input-md input-neutral w-full"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              required
            />
          </label>
        </div>
        <label class="input input-neutral w-full">
          <span class="label mb-0">Due Date</span>
          <input
            ref={calendarRef!}
            type="date"
            disabled={repeat()}
            class="block"
            value={date()}
            onInput={(e) => setDate(e.currentTarget.value)}
          />
        </label>
        <div class="flex gap-4">
          <label class="label mb-0">Repeat: </label>
          <input
            type="checkbox"
            checked={repeat()}
            class="toggle toggle-neutral"
            onInput={() => setRepeat((prev) => !prev)}
          />
        </div>
        <Show when={repeat()}>
          <div class="flex gap-6">
            <label class="label">Every:</label>
            <div class="flex gap-2 w-full">
              <select
                onInput={(e) =>
                  setAmount(e.currentTarget.value as unknown as periodAmount)
                }
                class="select select-neutral flex-1/4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
              <select
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
              ref={repeatCalendarRef!}
              type="date"
              class="block"
              value={date()}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </label>
        </Show>
        <div class="flex gap-4">
          <label class="label">Motivation:</label>
          <div class="rating gap-1">
            <input
              type="radio"
              name="rating"
              class="mask mask-heart bg-primary"
              aria-label="1 star"
              onInput={() => setMotivation(1)}
            />
            <input
              type="radio"
              name="rating"
              class="mask mask-heart bg-primary"
              aria-label="2 star"
              onInput={() => setMotivation(2)}
            />
            <input
              type="radio"
              name="rating"
              class="mask mask-heart bg-primary"
              aria-label="3 star"
              onInput={() => setMotivation(3)}
              checked
            />
            <input
              type="radio"
              name="rating"
              class="mask mask-heart bg-primary"
              aria-label="4 star"
              onInput={() => setMotivation(4)}
            />
            <input
              type="radio"
              name="rating"
              class="mask mask-heart bg-primary"
              aria-label="5 star"
              onInput={() => setMotivation(5)}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default NewTaskModal;

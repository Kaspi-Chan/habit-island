import { createSignal } from "solid-js";
import FormModal from "../misc/FormModal";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { addTask } from "../../firebase/firestore";
import { userInfo } from "../store/userStore";

const NewTaskModal = () => {
  const today = () => new Date().toISOString().split("T")[0];
  const [title, setTitle] = createSignal("");
  const [date, setDate] = createSignal(today());
  let calendarRef: HTMLInputElement;

  const handleNewTask = async (modal: HTMLDialogElement) => {
    try {
      await addTask(userInfo.id, {
        title: title(),
        date: new Date(date()),
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
        <input
          ref={calendarRef!}
          type="date"
          class="input input-neutral w-full"
          value={date()}
          onInput={(e) => setDate(e.currentTarget.value)}
        />
      </div>
    </FormModal>
  );
};

export default NewTaskModal;

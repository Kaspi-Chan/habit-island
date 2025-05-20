import { createSignal } from "solid-js";
import AuthModal from "../misc/AuthModal";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { addTask } from "../../firebase/firestore";
import { userInfo } from "../store/userStore";

const NewTaskModal = () => {
  const [title, setTitle] = createSignal("");
  const [category, setCategory] = createSignal("");
  const [date, setDate] = createSignal("");

  const handleNewTask = async (modal: HTMLDialogElement) => {
    console.log(userInfo.id);
    try {
      await addTask(userInfo.id, {
        title: title(),
        category: category(),
        date: new Date(date()),
      });
    } catch (error) {
      console.log(error);
    }
    modal.close();
  };

  return (
    <AuthModal
      id="new-task-modal"
      title="Create new goal"
      buttonText="Set goal"
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
        <div class="flex flex-col justify-center items-center">
          <label class="floating-label w-full">
            <span>Task Category</span>
            <input
              type="text"
              placeholder="Goal title"
              class="input input-md input-neutral w-full"
              value={category()}
              onInput={(e) => setCategory(e.currentTarget.value)}
              required
            />
          </label>
        </div>
        <input
          type="date"
          class="input input-neutral w-full"
          value={date()}
          onInput={(e) => setDate(e.currentTarget.value)}
        />
      </div>
    </AuthModal>
  );
};

export default NewTaskModal;

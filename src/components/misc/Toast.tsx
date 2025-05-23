import { Show } from "solid-js";
import { useToast } from "../store/toastStore";

const Toast = () => {
  const toast = useToast();

  const type = () =>
    toast().type === "success" ? "alert-success" : "alert-error";

  return (
    <Show when={toast().show}>
      <div class="toast toast-top toast-center -translate-x-[55%]">
        <div role="alert" class={`alert alert-soft ${type()}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{toast().message}</span>
        </div>
      </div>
    </Show>
  );
};

export default Toast;

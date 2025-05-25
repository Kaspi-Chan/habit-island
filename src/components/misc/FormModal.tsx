// ModalForm.tsx
import { createSignal, onMount, ParentProps } from "solid-js";

type ModalFormProps = {
  id: string;
  title: string;
  class?: string;
  onSubmit: (dialogRef: HTMLDialogElement) => Promise<string | undefined>; // should return an error message or null if no error
  buttonText?: string;
  onReset?: () => void;
} & ParentProps;

const FormModal = (props: ModalFormProps) => {
  let dialogRef!: HTMLDialogElement;
  const [error, setError] = createSignal<string | null>(null);

  const resetForm = () => {
    setError(null);
    const form = dialogRef.querySelector("form[method='post']");
    if (form instanceof HTMLFormElement) {
      form.reset();
      props.onReset?.();
    }
  };

  onMount(() => {
    dialogRef.addEventListener("close", resetForm);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const err = await props.onSubmit(dialogRef);
    if (err) setError(err);
  };

  return (
    <dialog ref={dialogRef} id={props.id} class="modal">
      <div
        class={`modal-box bg-base-200 flex flex-col justify-center items-center max-w-sm overflow-visible ${props.class}`}>
        <form method="dialog">
          <button class="btn text-lg btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h2 class="text-2xl font-bold text-center mb-6">{props.title}</h2>
        <form
          method="post"
          class="flex flex-col gap-6  w-full"
          onSubmit={handleSubmit}>
          {props.children}
          <div
            role="alert"
            class={`alert alert-error ${error() ? "" : "hidden"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error()}</span>
          </div>
          <button class="btn btn-neutral" type="submit">
            {props.buttonText || "Submit"}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default FormModal;

// toastStore.ts
import { createSignal } from "solid-js";

interface ToastState {
  show: boolean;
  message: string;
  duration: number;
  type: ToastType;
}

type ToastType = "success" | "error" | "info" | "warning";

const [toast, setToast] = createSignal<ToastState>({
  show: false,
  message: "",
  duration: 3000,
  type: "success",
});

export function showToast(
  message: string,
  duration: number = 3000,
  type: ToastType = "success"
) {
  setToast({ show: true, message, duration, type });

  // auto‐hide
  setTimeout(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, duration);
}

export const useToast = () => toast;

import { createEffect, createSignal, onMount } from "solid-js";
import { registerWithEmail } from "../../../firebase/auth.js";
import { useAuth } from "../../../context/AuthProvider.jsx";

const Register = () => {
  let dialogRef!: HTMLDialogElement;

  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const user = useAuth();

  const validatePassword = (confirmField: HTMLInputElement) => {
    if (password() !== confirmField.value) {
      confirmField.setCustomValidity("Passwords do not match");
    } else {
      confirmField.setCustomValidity("");
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");

    const form = dialogRef.querySelector("form[method='post']");
    if (form instanceof HTMLFormElement) form.reset();
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const newUser = await registerWithEmail(email(), password());
      user.setUser(newUser.user);
    } catch (error) {
      // Handle error here
    }

    dialogRef.close();
  };

  onMount(() => {
    dialogRef.addEventListener("close", resetForm);
  });

  return (
    <dialog ref={dialogRef} id="register-modal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h2 class="text-2xl font-bold text-center">Register</h2>
        <form
          method="post"
          class="flex flex-col gap-6 px-4 py-6"
          onsubmit={onSubmit}>
          <div class="space-y-3 flex flex-col ">
            <div>
              <input
                type="text"
                placeholder="Username"
                required
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                minlength="3"
                maxlength="30"
                class="input input-neutral validator"
              />
              <p class="validator-hint hidden">Must be 3 to 30 characters</p>
            </div>
            <div>
              <input
                class="input input-neutral validator"
                type="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                required
                placeholder="mail@site.com"
              />
              <p class="validator-hint hidden">Enter valid email address</p>
            </div>
            <div>
              <input
                type="password"
                class="input input-neutral validator"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                required
                placeholder="Password"
                minlength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
              <p class="validator-hint hidden">
                Must be more than 8 characters, including
                <br />
                At least one number
                <br />
                At least one lowercase letter
                <br />
                At least one uppercase letter
              </p>
            </div>
            <div>
              <input
                type="password"
                class="input input-neutral validator"
                onInput={(e) => validatePassword(e.currentTarget)}
                required
                placeholder="Confirm password"
              />
              <p class="validator-hint hidden">*Passowrds do not match</p>
            </div>
          </div>
          <button class="btn btn-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default Register;

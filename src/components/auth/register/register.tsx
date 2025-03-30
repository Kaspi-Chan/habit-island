import { createSignal } from "solid-js";
import { registerWithEmail } from "../../../firebase/auth.js";
import AuthModal from "../../misc/AuthModal.jsx";

const Register = () => {
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const validatePassword = (confirmField: HTMLInputElement) => {
    if (password() !== confirmField.value) {
      confirmField.setCustomValidity("Passwords do not match");
    } else {
      confirmField.setCustomValidity("");
    }
  };

  const handleRegister = async () => {
    const error = await registerWithEmail(email(), password(), username());

    if (error) return error;
  };

  return (
    <AuthModal
      id="register-modal"
      title="Registger"
      onSubmit={handleRegister}
      buttonText="Register">
      <div class="space-y-3 flex flex-col ">
        <div class="flex flex-col justify0-center items-center">
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
          <p class="validator-hint hidden w-full">Must be 3 to 30 characters</p>
        </div>
        <div class="flex flex-col justify0-center items-center">
          <input
            class="input input-neutral validator"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
            placeholder="mail@site.com"
          />
          <p class="validator-hint hidden w-full">Enter valid email address</p>
        </div>
        <div class="flex flex-col justify0-center items-center">
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
          <p class="validator-hint hidden w-full">
            Must be more than 8 characters, including
            <br />
            At least one number
            <br />
            At least one lowercase letter
            <br />
            At least one uppercase letter
          </p>
        </div>
        <div class="flex flex-col justify0-center items-center">
          <input
            type="password"
            class="input input-neutral validator"
            onInput={(e) => validatePassword(e.currentTarget)}
            required
            placeholder="Confirm password"
          />
          <p class="validator-hint hidden w-full">*Passwords do not match</p>
        </div>
      </div>
    </AuthModal>
  );
};

export default Register;

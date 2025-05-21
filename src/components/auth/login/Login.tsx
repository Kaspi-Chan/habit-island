import { createSignal, onMount } from "solid-js";
import { loginWithEmail } from "../../../firebase/auth.js";
import FormModal from "../../misc/FormModal.jsx";

const Login = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleLogin = async () => {
    const error = await loginWithEmail(email(), password());

    if (error) return error;
  };

  return (
    <FormModal
      id="login-modal"
      title="Login"
      onSubmit={handleLogin}
      buttonText="Login">
      <div class="space-y-3 flex flex-col ">
        <div class="flex flex-col justify-center items-center">
          <label class="label w-full">Email</label>
          <input
            class="input input-neutral validator w-full"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
            placeholder="mail@site.com"
          />
          <p class="validator-hint hidden w-full">Enter valid email address</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <label class="label w-full">Password</label>
          <input
            type="password"
            class="input input-neutral validator w-full"
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
      </div>
    </FormModal>
  );
};

export default Login;

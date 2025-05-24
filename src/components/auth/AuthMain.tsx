import { createEffect } from "solid-js";
import { loginWithGoogle } from "../../firebase/auth.js";
import Login from "./login/Login.jsx";
import Register from "./register/register.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";

const AuthMain = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (user()) {
      navigate("/", { replace: true });
    }
  });

  const handleLogin = () => {
    const loginModal = document.getElementById(
      "login-modal"
    ) as HTMLDialogElement;

    loginModal.showModal();
  };

  const handleRegister = () => {
    const registerModal = document.getElementById(
      "register-modal"
    ) as HTMLDialogElement;

    registerModal.showModal();
  };

  const handleGoogleAuth = () => {
    loginWithGoogle();
  };

  return (
    <main
      class="min-h-screen flex flex-col justify-center items-center 
            bg-gradient-to-br from-blue-100 to-teal-100 px-4">
      <div
        class="max-w-xl w-full bg-base-100 text-base-content text-center rounded-2xl 
        shadow-lg p-10 space-y-6">
        <h1 class="text-4xl font-bold text-primary">Welcome to Habit Island</h1>
        <div class="space-y-3">
          <p>
            Habit Island is a habit tracking app that helps you build and
            maintain good habits.
          </p>
          <p>
            With Habit Island, you can set goals, track your progress, and stay
            motivated.
          </p>
          <p>
            All of this while taking care of your personal little animal island!
          </p>
          <p>Invite more animal friends while keeping track of your life!</p>
          <p>Join us on this journey to a better you!</p>
        </div>
        <div class="divider"></div>
        <div class="flex flex-col">
          <div class="flex flex-col">
            <div class="text-sm mb-2">Already have an account?</div>
            <button class="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
          <div class="flex flex-col">
            <div class="text-sm divider divider-accent mb-4">New here?</div>
            <button class="btn btn-secondary" onClick={handleRegister}>
              Register
            </button>
          </div>
          <div class="flex flex-col">
            <div class="text-sm divider divider-[#fff] mb-4">Alternatively</div>
            <button
              class="btn  text-white border-[#e5e5e5]"
              onClick={handleGoogleAuth}>
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                </g>
              </svg>
              Login with Google
            </button>
          </div>
        </div>
      </div>
      <Register />
      <Login />
    </main>
  );
};

export default AuthMain;

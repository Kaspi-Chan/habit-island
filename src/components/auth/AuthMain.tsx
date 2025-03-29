import Register from "./register/register.jsx";

const AuthMain = () => {
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
        </div>
      </div>
      <Register />
    </main>
  );
};

export default AuthMain;

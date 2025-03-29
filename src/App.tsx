import { createSignal, Show, type Component } from "solid-js";
import styles from "./App.module.css";
import Nav from "./components/Nav.jsx";
import TasksList from "./components/TasksList.jsx";
import MainView from "./components/MainView.jsx";
import Island from "./components/Island.jsx";
import AuthMain from "./components/auth/AuthMain.jsx";
import { AuthProvider, useAuth } from "./context/AuthProvider.jsx";

const App: Component = () => {
  const user = useAuth();
  console.log(user.user());

  return (
    <AuthProvider>
      <div class="container mx-auto h-screen">
        <Nav />
        <Show when={user.user()}>
          <Island />
          <MainView />
        </Show>
        <Show when={user.user() === null}>
          <AuthMain />
        </Show>
      </div>
    </AuthProvider>
  );
};

export default App;

import { Show, type Component } from "solid-js";
import Home from "./components/Home.jsx";
import AuthMain from "./components/auth/AuthMain.jsx";
import { useAuth } from "./context/AuthProvider.jsx";
import { Route, Router } from "@solidjs/router";
import RouteGuard from "./components/router/RouteGuard.jsx";

const App: Component = () => {
  const { loading } = useAuth();
  return (
    <Show when={!loading()}>
      <Router>
        <Route path="/signin" component={AuthMain} />
        <Route path="/" component={RouteGuard}>
          <Route path="/" component={Home} />
        </Route>
      </Router>
    </Show>
  );
};

export default App;

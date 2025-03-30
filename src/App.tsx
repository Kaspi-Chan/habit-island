import { createEffect, createSignal, Show, type Component } from "solid-js";
import Home from "./components/Home.jsx";
import AuthMain from "./components/auth/AuthMain.jsx";
import { AuthProvider, useAuth } from "./context/AuthProvider.jsx";
import { Route, Router } from "@solidjs/router";
import RouteGuard from "./components/router/RouteGuard.jsx";

const App: Component = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/signin" component={AuthMain} />
        <Route path="/" component={RouteGuard}>
          <Route path="/" component={Home} />
          <Route path="/test" component={Home} />
        </Route>
      </Router>
    </AuthProvider>
  );
};

export default App;

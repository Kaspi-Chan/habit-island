import { createEffect, ParentComponent } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Nav from "../nav/Nav.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";

const RouteGuard: ParentComponent = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  createEffect(() => {
    if (!user()) {
      navigate("/signin", { replace: true });
    }
  });

  return (
    <>
      <Nav />
      {props.children}
    </>
  );
};

export default RouteGuard;

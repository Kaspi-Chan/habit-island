import { Show } from "solid-js";
import { logout } from "../../firebase/auth.js";
import { openAnimalCatalogue } from "../../utils/utils.js";
import { showStatus } from "../store/userStore.js";
import AudioToggle from "../audio/AudioToggle.jsx";

interface Props {
  open: boolean;
}

const NavList = (props: Props) => {
  return (
    <ul
      class={`${
        props.open ? "visible opacity-100" : "invisible opacity-0"
      } menu bg-base-200 rounded-box gap-4 transition-all duration-300`}>
      <li>
        <div class="indicator">
          <Show when={showStatus()}>
            <span class="indicator-item status status-info"></span>
          </Show>
          <a
            class="tooltip tooltip-left"
            data-tip="Animal catalogue"
            onClick={openAnimalCatalogue}>
            <svg
              fill="currentColor"
              class="h-5 w-5 fill-current"
              version="1.1"
              id="paw"
              viewBox="0 0 48.839 48.839">
              <g>
                <path
                  style="fill:currentColor;"
                  d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252
		c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373
		c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742
		c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181
		C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0
		S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971
		s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878
		c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z
		 M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414
		S48.455,16.861,45.727,15.602z"
                />
              </g>
            </svg>
          </a>
        </div>
      </li>
      <AudioToggle />
      <li>
        <a class="tooltip tooltip-left" data-tip="Logout" onclick={logout}>
          <svg
            fill="currentColor"
            class="h-5 w-5"
            viewBox="0 0 384.971 384.971">
            <g>
              <g id="Sign_Out">
                <path
                  d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
			C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
			C192.485,366.299,187.095,360.91,180.455,360.91z"
                />
                <path
                  d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
			c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
			c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"
                />
              </g>
            </g>
          </svg>
        </a>
      </li>
    </ul>
  );
};

export default NavList;

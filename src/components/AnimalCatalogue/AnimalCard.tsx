import { Accessor, Setter, Show } from "solid-js";
import { userInfo } from "../store/userStore";

interface AnimalCardProps {
  name: string;
  image: string;
  requiredLvl: number;
  selected: Accessor<string>;
  setSelected: Setter<string>;
}

const AnimalCard = (props: AnimalCardProps) => {
  const isDisabled = () => props.requiredLvl > userInfo.level;
  const handleClick = () => {
    if (isDisabled()) return;

    props.setSelected(props.name);
  };
  return (
    <div
      onClick={handleClick}
      class={`flex flex-col items-center rounded-lg shadow p-4 cursor-pointer relative border-2 border-neutral border-solid ${
        props.selected() === props.name ? "border-primary/100" : ""
      }`}>
      <div class="w-[90%] h-[90%] aspect-square flex items-center justify-center rounded ">
        <img
          src={props.image}
          alt="Bunny"
          class="object-contain max-w-full max-h-full"
        />
      </div>
      <Show when={isDisabled()}>
        <div class="absolute cursor-not-allowed top-0 left-0 w-full h-full p-4 rounded-xl grid place-content-center bg-base-100/75">
          <svg
            class="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-xs text-center">
            Need {props.requiredLvl - userInfo.level} more levels to unlock.
          </span>
        </div>
      </Show>
      <span class="mt-2 text-center font-medium text-xs lg:text-md">
        {props.name}
      </span>
    </div>
  );
};

export default AnimalCard;

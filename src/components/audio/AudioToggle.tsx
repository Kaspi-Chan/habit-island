import { createSignal, Show } from "solid-js";
import { createBackgroundMusic } from "./AudioHandler";

const AudioToggle = () => {
  const { muted, toggleMute, volume, changeVolume } = createBackgroundMusic();
  const [showVolume, setShowVolume] = createSignal(false);

  const handleMouseOver = () => {
    if (muted()) return;

    setShowVolume(true);
  };

  const handleMouseLeave = () => {
    setShowVolume(false);
  };

  return (
    <li>
      <div
        class="tooltip tooltip-left"
        data-tip="Toggle Music"
        onClick={toggleMute}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}>
        <Show when={muted()}>
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5 6.8935V5.57661C12.5 5.36926 12.5 5.26559 12.5347 5.17738C12.5653 5.09948 12.615 5.03052 12.6792 4.97682C12.752 4.91601 12.8503 4.88323 13.047 4.81766L17.447 3.35099C17.8025 3.23249 17.9803 3.17324 18.1218 3.20877C18.2456 3.23987 18.3529 3.31718 18.4216 3.42484C18.5 3.54783 18.5 3.7352 18.5 4.10994V7.42339C18.5 7.63074 18.5 7.73441 18.4653 7.82262C18.4347 7.90052 18.385 7.96948 18.3208 8.02318C18.248 8.08399 18.1497 8.11677 17.953 8.18234L14.8192 9.22692M12.5 12.5V18.5M12.5 18.5C12.5 19.8807 10.933 21 9 21C7.067 21 5.5 19.8807 5.5 18.5C5.5 17.1193 7.067 16 9 16C10.933 16 12.5 17.1193 12.5 18.5ZM3 3L21 21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <Show when={!muted()}>
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5 8.89001V18.5M12.5 8.89001V5.57656C12.5 5.36922 12.5 5.26554 12.5347 5.17733C12.5653 5.09943 12.615 5.03047 12.6792 4.97678C12.752 4.91597 12.8503 4.88318 13.047 4.81761L17.447 3.35095C17.8025 3.23245 17.9803 3.17319 18.1218 3.20872C18.2456 3.23982 18.3529 3.31713 18.4216 3.42479C18.5 3.54779 18.5 3.73516 18.5 4.10989V7.42335C18.5 7.63069 18.5 7.73436 18.4653 7.82258C18.4347 7.90048 18.385 7.96943 18.3208 8.02313C18.248 8.08394 18.1497 8.11672 17.953 8.18229L13.553 9.64896C13.1975 9.76746 13.0197 9.82671 12.8782 9.79119C12.7544 9.76009 12.6471 9.68278 12.5784 9.57512C12.5 9.45212 12.5 9.26475 12.5 8.89001ZM12.5 18.5C12.5 19.8807 10.933 21 9 21C7.067 21 5.5 19.8807 5.5 18.5C5.5 17.1192 7.067 16 9 16C10.933 16 12.5 17.1192 12.5 18.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <Show when={showVolume()}>
          <div class="w-56 absolute top-full right-0 z-20 bg-primary-content p-4 rounded-lg">
            <input
              type="range"
              class="w-full h-3 bg-neutral rounded-lg appearance-none"
              value={volume()}
              onClick={(e) => e.stopPropagation()}
              onInput={(e) => {
                const newVolume = parseFloat(
                  (e.target as HTMLInputElement).value
                );
                changeVolume(newVolume);
              }}
              min="0"
              max="1"
              step="0.01"
            />
          </div>
        </Show>
      </div>
    </li>
  );
};

export default AudioToggle;

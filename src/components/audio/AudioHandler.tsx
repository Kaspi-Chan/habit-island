import { createSignal, onCleanup, onMount } from "solid-js";

export function createBackgroundMusic() {
  const audio = [new Audio("/audio/bgm.mp3"), new Audio("/audio/ambient.wav")];
  const [muted, setMuted] = createSignal(true);
  const [isBlocked, setIsBlocked] = createSignal(false);
  const [volume, setVolume] = createSignal(0.5);

  onMount(() => {
    audio.forEach((a) => {
      a.muted = true;
      a.preload = "auto";
      a.loop = true;
      a.volume = volume();
      a.play().catch(() => {
        setIsBlocked(true);
        console.warn(
          "Background music playback failed. It might be blocked by the browser's autoplay policy."
        );
      });
    });
  });

  onCleanup(() => {
    audio.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    setMuted(true);
    setIsBlocked(false);
  });

  const toggleMute = () => {
    audio.forEach((a) => {
      a.muted = !a.muted;
      setMuted(a.muted);
      if (isBlocked()) {
        a.play()
          .then(() => {
            setIsBlocked(false);
          })
          .catch(() => {
            setIsBlocked(true);
          });
      }
    });
  };

  const changeVolume = (newVolume: number) => {
    if (newVolume < 0 || newVolume > 1) {
      console.warn("Volume must be between 0 and 1.");
      return;
    }
    audio.forEach((a) => {
      a.volume = newVolume;
    });
    setVolume(newVolume);
  };

  return { toggleMute, muted, volume, changeVolume };
}

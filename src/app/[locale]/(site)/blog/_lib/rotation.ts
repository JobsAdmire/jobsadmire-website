/**
 * B-4: the Pause/Play state the rotating hero word and its toggle share. They are two small
 * client islands — the word renders inside the h1, the button after the hero ticks, so the
 * heading's accessible name never contains a button label. Module state behind
 * `useSyncExternalStore`; the server and the hydrating client both read "playing". A plain
 * module (no directive, no React): only the two client islands import it.
 */
let paused = false;
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) listener();
};

export const rotation = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  isPaused: (): boolean => paused,
  isPausedOnServer: (): boolean => false,
  toggle(): void {
    paused = !paused;
    notify();
  },
  /** Tests only: back to "playing". */
  reset(): void {
    paused = false;
    notify();
  },
};

export type StateConfig<S extends string> = {
  /** how long (sec) to stay in this state */
  duration?: { min: number; max: number };
  /** called once when entering */
  onEnter?: () => void;
  /** called once when exiting */
  onExit?: () => void;
  /** pick the next state */
  getNext: () => S;
};

export class StateMachine<S extends string> {
  private timerId?: number;
  private current: S;

  constructor(initial: S, private config: Record<S, StateConfig<S>>) {
    this.current = initial;
    this.enterState(initial);
  }

  private enterState(state: S) {
    const cfg = this.config[state];
    cfg.onEnter?.();

    if (cfg.duration) {
      const { max, min } = cfg.duration;
      const wait = Math.random() * (max - min) + min;
      this.timerId = window.setTimeout(() => this.transition(), wait * 1000);
    }
  }

  private exitState(state: S) {
    this.config[state].onExit?.();
    clearTimeout(this.timerId);
  }

  public transition() {
    const prev = this.current;
    const next = this.config[prev].getNext();
    this.exitState(prev);
    this.current = next;
    this.enterState(next);
  }

  public goNext() {
    clearTimeout(this.timerId);
    this.transition();
  }

  public get state() {
    return this.current;
  }

  public stop() {
    clearTimeout(this.timerId);
    this.exitState(this.current);
  }
}

type Transition<S extends string> = {
  from: S;
  to: S;
  action?: () => void;
};

// Simple finite state machine
class StateMachine<S extends string> {
  private state: S;
  private transitions: Transition<S>[];

  constructor(initialState: S, transitions: Transition<S>[]) {
    this.state = initialState;
    this.transitions = transitions;
  }

  public getState(): S {
    return this.state;
  }

  public canTransition(to: S): boolean {
    return this.transitions.some((t) => t.from === this.state && t.to === to);
  }

  public transition(to: S): void {
    const t = this.transitions.find(
      (t) => t.from === this.state && t.to === to
    );
    if (!t) return;
    this.state = to;
    t.action?.();
  }

  public addTransition(transition: Transition<S>): void {
    this.transitions.push(transition);
  }
}

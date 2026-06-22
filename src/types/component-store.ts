export type ComponentStore<TState, TEffects> = {
    state: TState;
    effects: TEffects;
};

export type StateStore<TState> = {
    state: TState;
};

export type EffectsStore<TEffects> = {
    effects: TEffects;
};

export type ComponentStore<TState, TEffects> = {
    state: TState;
    effects: TEffects;
};

export type EmptyState = Record<string, never>;
export type EmptyEffects = Record<string, never>;

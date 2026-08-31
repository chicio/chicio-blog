import type { ReactNode } from 'react';

type GroupProps = {
  title: string;
  // Tag shown next to the title for groups not yet wired up ("wired in M6").
  // Omitted once a milestone activates its group.
  milestone?: string | undefined;
  disabled?: boolean;
  children: ReactNode;
};

export function Group({ title, milestone, disabled = true, children }: GroupProps) {
  return (
    <fieldset className="rail-group" disabled={disabled}>
      <legend>
        <span className="rail-group-title">{title}</span>
        {milestone ? <span className="rail-group-tag">{milestone}</span> : null}
      </legend>
      {children}
    </fieldset>
  );
}

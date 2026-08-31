import { useRootWithStatus } from '@typegpu/react';

import App from './App';

// App calls useConfigureContext + the renderer hook, both of which call useRoot()
// at the top of App's hook list. Before the GPU device is ready useRoot SUSPENDS
// mid-render — after some of App's hooks have already run — so the recorded hook
// list is shorter than the post-resolve replay, which WebKit's concurrent
// scheduler reports as a spurious "change in the order of Hooks" warning. A
// Suspense boundary can't fix this: the suspend is INSIDE App's hooks, not above
// it. Gating on useRootWithStatus (non-suspending) so App only mounts once the
// root is resolved means its useRoot() calls return synchronously and never
// suspend — the same pattern the public MatrixRainWebGPU component uses.
export default function PlaygroundApp() {
  const root = useRootWithStatus();
  if (root.status !== 'fulfilled') {
    return null;
  }
  return <App />;
}

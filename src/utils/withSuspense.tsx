// src/utils/withSuspense.tsx
import { Suspense, LazyExoticComponent, JSX } from "react";

export function withSuspense(
  Component: LazyExoticComponent<() => JSX.Element>,
  fallback: React.ReactNode = <div>Loading...</div>
) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

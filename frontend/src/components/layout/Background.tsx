/** Ambient atmosphere — drifting lime blooms and a fine grain, fixed behind the app. */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
    >
      <div className="absolute -left-48 -top-56 size-[40rem] animate-aurora rounded-full bg-accent/[0.08] blur-[140px]" />
      <div
        className="absolute -bottom-64 -right-48 size-[36rem] animate-aurora rounded-full bg-accent/[0.05] blur-[150px]"
        style={{ animationDelay: '-11s' }}
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.14] mix-blend-overlay" />
    </div>
  );
}

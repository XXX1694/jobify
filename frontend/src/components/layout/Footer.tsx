export function Footer() {
  return (
    <footer className="mt-auto border-t border-line/70 px-5 py-5 lg:px-8">
      <div className="mx-auto flex max-w-[88rem] flex-col items-center justify-between gap-2 text-2xs text-fg-faint sm:flex-row">
        <span>Jobify — developer job intelligence, built on the Go API.</span>
        <span className="flex items-center gap-1.5 font-mono uppercase tracking-[0.12em]">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          api · live
        </span>
      </div>
    </footer>
  );
}

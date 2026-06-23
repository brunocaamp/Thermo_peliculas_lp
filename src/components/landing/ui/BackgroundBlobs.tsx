export function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-[10vw] top-[8%] h-[28rem] w-[28rem] rounded-full bg-brand-400/25 blur-3xl" />
      <div className="absolute -right-[8vw] top-[40%] h-[24rem] w-[24rem] rounded-full bg-brand-200/50 blur-3xl" />
      <div className="absolute left-1/3 bottom-0 h-[20rem] w-[20rem] rounded-full bg-brand-900/10 blur-3xl" />
    </div>
  );
}

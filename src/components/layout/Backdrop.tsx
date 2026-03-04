export function Backdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute -top-40 left-[8%] w-[34rem] h-[34rem] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute -bottom-44 right-[6%] w-[30rem] h-[30rem] rounded-full bg-[#ff8c42]/10 blur-3xl" />
    </div>
  );
}
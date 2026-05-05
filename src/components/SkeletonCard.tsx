export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden animate-pulse h-full">
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30" />
      <div className="h-40 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
        <div className="h-3 w-1/2 bg-white/5 rounded-lg" />
        <div className="space-y-2 pt-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full" />
          <div className="h-1.5 w-full bg-white/10 rounded-full" />
        </div>
        <div className="h-10 w-full bg-white/10 rounded-xl mt-3" />
      </div>
    </div>
  );
}

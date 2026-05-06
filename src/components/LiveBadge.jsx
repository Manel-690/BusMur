export default function LiveBadge() {
  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-gray-100 dark:border-gray-800 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
        Ao vivo
      </span>
    </div>
  );
}
export default function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080c14]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white animate-pulse">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
            <rect x="2" y="5" width="20" height="14" rx="3" />
            <path d="M2 10h20M7 19v2M17 19v2" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">Carregando BusMur...</p>
      </div>
    </div>
  );
}
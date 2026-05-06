export default function Badge({ type = "info", children }) {
  const styles = {
    online: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ativa: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    offline: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    inativa: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    atrasada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    média: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    baixa: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${styles[type] || styles.info}`}>
      {children}
    </span>
  );
}

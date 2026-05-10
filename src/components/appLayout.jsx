import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#080c14] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {/* Adicionado um container para garantir que o conteúdo não fique "colado" no topo no mobile */}
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
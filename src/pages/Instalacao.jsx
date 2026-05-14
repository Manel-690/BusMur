import { Download, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function Instalacao() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#deff9a]/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-3xl w-full text-center space-y-8 z-10 mt-10">
        
        {/* Header / Logo */}
        <div className="inline-block border-l-4 border-[#deff9a] pl-4 mb-4">
          <h1 className="text-5xl font-bold text-left">Bus<span className="text-[#deff9a]">Mur</span></h1>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
          A sua cidade,<br /> no seu tempo.
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Baixe o aplicativo oficial e acompanhe seu ônibus em tempo real. Chega de esperar no ponto sem saber quando ele vai passar.
        </p>

        {/* Botão de Download Real */}
        <a 
          href="/busmur.apk" 
          download="BusMur.apk"
          className="bg-[#deff9a] hover:bg-[#cbf575] text-[#121212] font-bold text-lg md:text-xl py-4 px-10 rounded-full shadow-[0_0_20px_rgba(222,255,154,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-3 mx-auto w-full md:w-auto inline-flex"
        >
          <Download size={24} />
          Baixar para Android (.apk)
        </a>

        <p className="text-sm text-gray-500 mt-2">
          Versão 1.0.0 | Requer Android 8.0 ou superior
        </p>

        <hr className="border-gray-800 my-12" />

        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <MapPin className="text-indigo-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Tempo Real</h3>
            <p className="text-gray-400">Saiba exatamente onde o ônibus está no mapa e planeje sua saída.</p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <Clock className="text-[#deff9a] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Previsão Exata</h3>
            <p className="text-gray-400">Algoritmos inteligentes calculam o tempo estimado até o seu ponto.</p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <ShieldCheck className="text-indigo-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">100% Seguro</h3>
            <p className="text-gray-400">Aplicativo oficial, seguro e leve. Não consome toda a sua bateria.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
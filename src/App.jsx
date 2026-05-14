import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroMotorista from "./pages/CadastroMotorista";
import Linhas from "./pages/Linhas";
import LinhaDetalhe from "./pages/LinhaDetalhe";
import Mapa from "./pages/Mapa";
import Notificacoes from "./pages/Notificacoes";
import PainelMotorista from "./pages/PainelMotorista";
import AdminPanel from "./pages/AdminPanel";
import Configuracoes from "./pages/Configuracoes";
import Instalacao from "./pages/Instalacao"; // <-- Importação adicionada

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "600" },
              duration: 3000,
            }}
          />
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/cadastro-motorista" element={<CadastroMotorista />} />
            <Route path="/instalar" element={<Instalacao />} /> {/* <-- Rota adicionada */}

            {/* Rotas Protegidas */}
            <Route path="/linhas" element={<ProtectedRoute><Linhas /></ProtectedRoute>} />
            <Route path="/linhas/:id" element={<ProtectedRoute><LinhaDetalhe /></ProtectedRoute>} />
            <Route path="/mapa" element={<ProtectedRoute><Mapa /></ProtectedRoute>} />
            <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
            <Route path="/motorista" element={<ProtectedRoute roles={["driver"]}><PainelMotorista /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />

            {/* Redirecionamentos padrão */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
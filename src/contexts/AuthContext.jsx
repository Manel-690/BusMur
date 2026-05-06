import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  }

  const login = async (email, password, expectedRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error("Perfil não encontrado.");
    }

    if (profile.role !== expectedRole) {
      await supabase.auth.signOut();
      throw new Error(`Este usuário não é ${expectedRole}.`);
    }

    if (expectedRole === "driver" && profile.driver_status !== "approved") {
      await supabase.auth.signOut();
      throw new Error("Seu cadastro de motorista ainda não foi aprovado.");
    }

    setUser(profile);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Aqui está a grande alteração do Upload para o Storage
  const registerDriver = async ({ name, email, password, cpf, cnhFile }) => {
    if (!cnhFile) throw new Error("O arquivo da CNH é obrigatório.");

    // 1. Cadastra o usuário no Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "driver" } },
    });

    if (error) throw error;

    // 2. Faz o Upload da imagem da CNH para o Storage "driver-docs"
    const fileExt = cnhFile.name.split('.').pop();
    const fileName = `${data.user.id}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('driver-docs')
      .upload(fileName, cnhFile);

    if (uploadError) {
      console.error("Erro ao enviar imagem pro Storage:", uploadError);
      throw new Error("Não foi possível enviar a imagem da CNH.");
    }

    // 3. Aguarda a Trigger do banco criar a linha do perfil
    await new Promise((r) => setTimeout(r, 800));

    // 4. Atualiza a tabela profiles com o NOME do arquivo final
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cpf, cnh_image: fileName, driver_status: "pending" })
      .eq("id", data.user.id);

    if (updateError) console.error("Erro ao atualizar perfil:", updateError);

    return { success: true, status: "pending" };
  };

  const registerPassenger = async ({ name, email, password, phone, cpf }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "passenger" } },
    });

    if (error) throw error;

    await new Promise((r) => setTimeout(r, 800));

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ phone, cpf })
      .eq("id", data.user.id);

    if (updateError) console.error("Erro ao atualizar perfil:", updateError);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerDriver, registerPassenger }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
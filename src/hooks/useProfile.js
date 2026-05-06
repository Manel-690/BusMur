import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function useProfile(user) {
  const [loading, setLoading] = useState(false);

  async function updateProfile({ name, phone }) {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("id", user.id);

    if (error) {
      toast.error("Erro ao atualizar perfil.");
    } else {
      toast.success("Perfil atualizado!");
    }
    setLoading(false);
  }

  return { updateProfile, loading };
}
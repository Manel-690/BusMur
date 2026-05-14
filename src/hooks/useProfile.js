import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useProfile(user) {
  const [loading, setLoading] = useState(false);

  const updateProfile = async ({ name, avatarFile }) => {
    setLoading(true);
    console.log("Iniciando atualização para o ID:", user?.id);

    try {
      let avatar_url = null;

      // 1. Upload da foto (Se houver novo arquivo)
      if (avatarFile) {
        console.log("Processando nova imagem...");
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = data.publicUrl;
      }

      // 2. Preparar objeto de atualização
      // Apenas Nome e Foto são editáveis aqui
      const updates = {
        name: name,
        updated_at: new Date().toISOString(),
      };

      if (avatar_url) {
        updates.avatar_url = avatar_url;
      }

      console.log("Enviando dados para o Supabase:", updates);

      // 3. Executar o UPDATE
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
      return true;

    } catch (error) {
      console.error("Erro na função updateProfile:", error);
      toast.error(`Erro: ${error.message || 'Falha ao salvar'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}
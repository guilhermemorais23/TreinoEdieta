import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile() {
  const [formData, setFormData] = useState({
    weight: "", height: "", goal: "Perder Peso", activity_level: "Moderado"
  });

  // Busca os dados salvos quando a página carrega
  useEffect(() => {
    api.get("/users/profile")
      .then(res => { if (res.data.weight) setFormData(res.data); })
      .catch(err => console.log("Perfil novo"));
  }, []);

  const handleSave = async () => {
    try {
      await api.post("/users/profile", formData);
      alert("✅ Perfil Salvo! Agora você pode gerar o treino.");
    } catch (err) {
      alert("❌ Erro ao salvar.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg">
      <h2 className="text-2xl font-black mb-4">🎯 Configurar Meu Plano</h2>
      <div className="space-y-4">
        <input type="number" placeholder="Peso (kg)" value={formData.weight}
          className="w-full p-2 border rounded-xl"
          onChange={(e) => setFormData({...formData, weight: e.target.value})} />
        
        <input type="number" placeholder="Altura (cm)" value={formData.height}
          className="w-full p-2 border rounded-xl"
          onChange={(e) => setFormData({...formData, height: e.target.value})} />

        <select className="w-full p-2 border rounded-xl" value={formData.goal}
          onChange={(e) => setFormData({...formData, goal: e.target.value})}>
          <option value="Perder Peso">Perder Peso</option>
          <option value="Ganhar Massa">Ganhar Massa</option>
        </select>

        <button onClick={handleSave} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">
          Salvar Dados no Perfil
        </button>
      </div>
    </div>
  );
}
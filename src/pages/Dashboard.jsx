import React, { useState, useEffect } from "react";
import api from "../services/api";
import { 
  Camera, Trash2, Flame, Target, Utensils, 
  BrainCircuit, UserCircle, Activity, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileForm"; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mRes, pRes] = await Promise.all([
        api.get("/meals").catch(() => ({ data: [] })),
        api.get("/users/profile").catch(() => ({ data: null }))
      ]);
      setMeals(mRes.data);
      setProfile(pRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados do Dashboard");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir esta refeição?")) return;
    try {
      await api.delete(`/meals/${id}`);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      await api.post("/meals/analyze", formData);
      loadData();
    } catch (err) {
      alert("Erro ao analisar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans overflow-x-hidden">
      {/* Navbar Superior */}
      <nav className="bg-white/80 backdrop-blur-md p-4 shadow-sm flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          FitLog IA
        </h1>
        <button 
          onClick={() => setShowProfile(!showProfile)} 
          className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition"
        >
          <UserCircle size={26} />
        </button>
      </nav>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Modal de Perfil */}
        {showProfile && (
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-indigo-50 animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Meu Perfil IA</h2>
                <button onClick={() => setShowProfile(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold">✕</button>
             </div>
            <ProfileForm onPlanGenerated={() => { loadData(); setShowProfile(false); }} />
          </div>
        )}

        {/* 1. CARD DE META (Design Fit - Sem Cortes) */}
        {profile?.calories_target ? (
          <div className="px-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1 text-indigo-100">Meta Diária</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter">{profile.calories_target}</span>
                      <span className="text-sm font-bold opacity-70">kcal</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <BrainCircuit size={22} />
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/5 mt-2">
                  <p className="text-xs leading-relaxed font-medium opacity-90 line-clamp-3">
                    {profile.plan_text}
                  </p>
                  <button 
                    onClick={() => alert(profile.plan_text)} 
                    className="flex items-center gap-1 text-[10px] font-black uppercase mt-3 text-indigo-200 hover:text-white transition"
                  >
                    Ver plano completo <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-1 bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-indigo-100 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
               <Target className="text-indigo-400" size={28} />
             </div>
             <p className="text-gray-500 font-medium mb-4">Personalize sua dieta e treinos com nossa IA.</p>
             <button onClick={() => setShowProfile(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition">
               Configurar agora
             </button>
          </div>
        )}

        {/* 2. BOTÕES DE NAVEGAÇÃO (Semanal e Treinos) */}
        <div className="grid grid-cols-2 gap-4 px-1">
          <button 
            onClick={() => navigate("/resumo-semanal")} 
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition hover:bg-orange-50/50"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Flame className="text-orange-500" size={24} />
            </div>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Semanal</span>
          </button>

          <button 
            onClick={() => navigate("/treinos")} 
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition hover:bg-purple-50/50"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Target className="text-purple-500" size={24} />
            </div>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Treinos</span>
          </button>
        </div>

        {/* 3. LISTA DE REFEIÇÕES (Design de Linha do Tempo) */}
        <div className="px-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Utensils size={20} className="text-indigo-600" />
              Hoje
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-lg">
              {meals.length} Registros
            </span>
          </div>
          
          <div className="space-y-3">
            {meals.length === 0 ? (
               <div className="text-center py-12 text-gray-400 bg-white rounded-[2rem] border border-dashed border-gray-200">
                 Nenhuma refeição registrada
               </div>
            ) : (
              meals.map(meal => (
                <div key={meal.id} className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-50 flex justify-between items-center group transition hover:border-indigo-100">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base mb-1">{meal.title}</p>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-[10px] font-bold text-gray-500 px-2 py-1 rounded-md">{meal.calories} kcal</span>
                      <span className="bg-indigo-50 text-[10px] font-bold text-indigo-600 px-2 py-1 rounded-md">{meal.protein}g P</span>
                      <span className="bg-purple-50 text-[10px] font-bold text-purple-600 px-2 py-1 rounded-md">{meal.carbs}g C</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(meal.id)} 
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. BOTÃO FLUTUANTE DE CÂMERA (Centralizado e Estilizado) */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-40 pointer-events-none">
        <label className="bg-indigo-600 text-white px-8 py-4 rounded-full shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-3 pointer-events-auto">
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Camera size={24} />
          )}
          <span className="font-bold text-sm tracking-wide">Escanear Prato</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={loading} />
        </label>
      </div>
    </div>
  );
}
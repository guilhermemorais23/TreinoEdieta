import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft, Calendar, TrendingUp, Award, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WeeklySummary() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      // Carregamos os dados da semana e o perfil para saber a meta
      const [statsRes, profileRes] = await Promise.all([
        api.get("/meals/stats/weekly"),
        api.get("/users/profile")
      ]);
      setData(statsRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error("Erro ao carregar resumo");
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = [
    { label: "Seg", key: "Monday" },
    { label: "Ter", key: "Tuesday" },
    { label: "Qua", key: "Wednesday" },
    { label: "Qui", key: "Thursday" },
    { label: "Sex", key: "Friday" },
    { label: "Sáb", key: "Saturday" },
    { label: "Dom", key: "Sunday" },
  ];

  const metaKcal = profile?.calories_target || 2000;

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={22} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-black text-gray-800">Resumo da Semana</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Card de Performance Geral */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Média Semanal</p>
            <h2 className="text-3xl font-black text-indigo-600">
              {data.length > 0 ? Math.round(data.reduce((acc, d) => acc + d.total_calories, 0) / 7) : 0} 
              <span className="text-sm font-bold text-gray-400 ml-1">kcal/dia</span>
            </h2>
          </div>
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <TrendingUp size={28} />
          </div>
        </div>

        {/* Gráfico de Barras Vertical */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <Target size={18} className="text-indigo-500" />
            <span className="font-bold text-gray-700">Calorias por Dia</span>
          </div>

          <div className="flex justify-between items-end h-48 gap-2">
            {diasSemana.map((dia) => {
              const diaDados = data.find(d => d.day === dia.key) || { total_calories: 0 };
              const percentagem = Math.min((diaDados.total_calories / metaKcal) * 100, 100);
              
              return (
                <div key={dia.key} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-32 relative overflow-hidden flex flex-col justify-end">
                    <div 
                      className={`w-full rounded-full transition-all duration-700 ${percentagem > 100 ? 'bg-red-400' : 'bg-indigo-500'}`}
                      style={{ height: `${percentagem}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">{dia.label}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Dentro da Meta</span>
            </div>
            <div className="text-[10px] font-black text-gray-400">Meta: {metaKcal} kcal</div>
          </div>
        </div>

        {/* Listagem de Destaques (Macros) */}
        <div className="space-y-4">
          <h3 className="font-black text-gray-800 px-1 flex items-center gap-2">
            <Award size={20} className="text-orange-500" />
            Consumo de Nutrientes
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-5 rounded-[2rem] border border-orange-100">
              <p className="text-[10px] font-black text-orange-600 uppercase mb-1">Proteína Total</p>
              <p className="text-2xl font-black text-orange-700">
                {data.reduce((acc, d) => acc + (d.total_protein || 0), 0)}g
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Carbo Total</p>
              <p className="text-2xl font-black text-blue-700">
                {data.reduce((acc, d) => acc + (d.total_carbs || 0), 0)}g
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
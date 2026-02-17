import React, { useState } from "react";
import api from "../services/api";

export default function Workouts() {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/workouts/generate");
      setWorkout(res.data);
    } catch (err) {
      alert("Erro ao gerar treino. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">
      <h1 className="text-3xl font-black text-gray-800 mb-6 text-center uppercase tracking-tighter">
        Minha Ficha <span className="text-indigo-600">PRO</span>
      </h1>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all mb-10 uppercase text-lg"
      >
        {loading ? "⏳ Criando sua estratégia..." : "🔥 Gerar Novo Treino (5 Dias)"}
      </button>

      {workout && (
        <div className="space-y-8">
          {Object.entries(workout).map(([dia, info]) => (
            <div key={dia} className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-50">
              <div className="bg-gray-900 p-4">
                <h2 className="text-2xl font-black text-white uppercase text-center italic">
                  🚀 {dia}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* MOBILIDADE */}
                <div className="bg-blue-50 p-4 rounded-2xl border-l-4 border-blue-400">
                  <h4 className="text-blue-700 font-bold text-xs uppercase mb-1">🧘 Mobilidade Articular (Opcional)</h4>
                  <p className="text-gray-700 text-sm leading-tight">{info.mobilidade}</p>
                </div>

                {/* TREINO PRINCIPAL */}
                <div>
                  <h4 className="text-indigo-600 font-black text-xs uppercase mb-3 flex items-center">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span> Treino Principal
                  </h4>
                  <div className="text-gray-900 font-medium whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {info.treino}
                  </div>
                </div>

                {/* FINALIZAÇÃO */}
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase italic">🏁 Finalização: {info.finalizacao}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
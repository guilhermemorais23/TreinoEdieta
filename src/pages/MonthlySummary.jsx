import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft, Calendar, BarChart3, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MonthlySummary() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    api.get("/meals").then(res => setMeals(res.data));
  }, []);

  const totalMonthKcal = meals.reduce((acc, m) => acc + Number(m.calories || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={() => navigate("/dashboard")} className="mb-6 p-2 bg-white rounded-xl shadow-sm"><ArrowLeft/></button>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100 mb-6">
        <Calendar className="mx-auto text-indigo-600 mb-4" size={40} />
        <h2 className="text-gray-500 font-bold uppercase text-xs tracking-widest">Consumo Mensal</h2>
        <p className="text-5xl font-black text-gray-900 mt-2">{totalMonthKcal}</p>
        <p className="text-gray-400 text-sm mt-1">calorias totais no mês</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl"><Award/></div>
          <div>
            <p className="font-black text-gray-800">Consistência</p>
            <p className="text-sm text-gray-500">Você registrou 22 dias este mês!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
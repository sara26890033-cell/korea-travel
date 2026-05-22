/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  initialItinerary,
  initialLuggageCategories,
  initialPhrases
} from "./data";
import { ItineraryTab } from "./components/ItineraryTab";
import { LuggageTab } from "./components/LuggageTab";
import { BasicInfoTab } from "./components/BasicInfoTab";
import { TranslatorTab } from "./components/TranslatorTab";
import { FinanceTab } from "./components/FinanceTab";
import { TopNav } from "./components/TopNav";
import { LuggageCategory, ExpenseRecord, PhraseItem } from "./types";
import { Compass } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("itinerary");

  // State loaded from localStorage for absolute data persistence
  const [luggage, setLuggage] = useState<LuggageCategory[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [phrases, setPhrases] = useState<PhraseItem[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0.024); // Fallback: 1 KRW ≈ 0.024 TWD
  const [appLoaded, setAppLoaded] = useState<boolean>(false);

  // Load persistence
  useEffect(() => {
    try {
      const storedLuggage = localStorage.getItem("busan_companion_luggage_v3");
      if (storedLuggage) {
        setLuggage(JSON.parse(storedLuggage));
      } else {
        setLuggage(initialLuggageCategories);
      }

      const storedExpenses = localStorage.getItem("busan_companion_expenses_v2");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses([]); // starts clean
      }

      const storedPhrases = localStorage.getItem("busan_companion_phrases_v2");
      if (storedPhrases) {
        setPhrases(JSON.parse(storedPhrases));
      } else {
        setPhrases(initialPhrases);
      }

      const storedRate = localStorage.getItem("busan_companion_rate_v2");
      if (storedRate) {
        setExchangeRate(parseFloat(storedRate));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
      setLuggage(initialLuggageCategories);
      setPhrases(initialPhrases);
    } finally {
      setAppLoaded(true);
    }
  }, []);

  // Save states securely
  const saveLuggage = (data: LuggageCategory[]) => {
    setLuggage(data);
    localStorage.setItem("busan_companion_luggage_v3", JSON.stringify(data));
  };

  const saveExpenses = (data: ExpenseRecord[]) => {
    setExpenses(data);
    localStorage.setItem("busan_companion_expenses_v2", JSON.stringify(data));
  };

  const savePhrases = (data: PhraseItem[]) => {
    setPhrases(data);
    localStorage.setItem("busan_companion_phrases_v2", JSON.stringify(data));
  };

  const saveExchangeRate = (rate: number) => {
    setExchangeRate(rate);
    localStorage.setItem("busan_companion_rate_v2", rate.toString());
  };

  // 1. Luggage events
  const handleToggleLuggageItem = (categoryId: string, itemId: string) => {
    const next = luggage.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          })
        };
      }
      return cat;
    });
    saveLuggage(next);
  };

  const handleResetLuggage = () => {
    if (window.confirm("確定要重設所有行李包打包進度嗎？")) {
      const next = luggage.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, checked: false }))
      }));
      saveLuggage(next);
    }
  };

  const handleCheckAllLuggage = () => {
    const next = luggage.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item, checked: true }))
    }));
    saveLuggage(next);
  };

  // 2. Expense/Budget events
  const handleAddExpense = (
    spotId: string,
    day: number,
    amount: number,
    description: string
  ) => {
    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      spotId,
      day,
      amount,
      description
    };
    saveExpenses([...expenses, newRecord]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    saveExpenses(expenses.filter((e) => e.id !== expenseId));
  };

  // 3. Translator phrases events
  const handleAddPhrase = (
    chinese: string,
    korean: string,
    pronunciation?: string
  ) => {
    const newPhrase: PhraseItem = {
      id: `phr-${Date.now()}`,
      chinese,
      korean,
      pronunciation,
      category: "我的自訂"
    };
    savePhrases([...phrases, newPhrase]);
  };

  const handleDeletePhrase = (phraseId: string) => {
    savePhrases(phrases.filter((p) => p.id !== phraseId));
  };

  // Dynamic calculations for navbar status or header
  const totalSpendKRW = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (!appLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF5EB] flex flex-col justify-center items-center p-6 text-center">
        <Compass className="w-12 h-12 text-[#A47551] animate-spin mb-4" />
        <h2 className="font-serif font-bold text-lg text-[#3F2B20]">釜山日和・加載助手資料中</h2>
        <p className="text-xs text-[#8C7E74] mt-1">正在載入專屬的 4 天 3 夜隨同筆記...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EB] py-0 md:py-6 selection:bg-[#A47551]/20">
      {/* Phone template frame for desktop viewports + full screen mobile */}
      <div className="max-w-md mx-auto h-screen md:h-[850px] bg-[#FAF5EB] md:rounded-3xl border-0 md:border-6 md:border-[#E8E1D5] md:shadow-lg relative flex flex-col overflow-hidden">
        
        {/* Custom Retro Cream Top Header */}
        <header className="bg-[#FFFDF9] border-b border-[#E8E1D5]/30 px-5.5 pt-5.5 pb-4.5 flex-shrink-0 z-10 relative flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-sans font-black tracking-widest text-[#FFFDF9] bg-[#768A7A] px-2.5 py-0.5 rounded-md uppercase">
                BUSAN
              </span>
              <span className="text-[10px] font-bold text-[#8C7E74]">
                2026・4天3夜隨行旅記
              </span>
            </div>
            <h1 className="font-serif font-black text-2xl tracking-tight text-[#3F2B20]">
              四美同遊蔚藍海岸
            </h1>
          </div>
          <div className="text-right">
            <span className="text-lg font-black font-sans text-[#A47551] select-none tracking-widest uppercase">
              KR
            </span>
          </div>
        </header>

        {/* Top PWA Style Mobile Navigation */}
        <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab View Container */}
        <main className="flex-1 overflow-y-auto px-4.5 py-5 no-scrollbar scroll-smooth">
          {activeTab === "itinerary" && (
            <div className="animate-fade-in duration-300">
              <ItineraryTab
                itinerary={initialItinerary}
                expenses={expenses}
                addExpense={handleAddExpense}
                deleteExpense={handleDeleteExpense}
                exchangeRate={exchangeRate}
              />
            </div>
          )}

          {activeTab === "luggage" && (
            <div className="animate-fade-in duration-300">
              <LuggageTab
                categories={luggage}
                toggleItem={handleToggleLuggageItem}
                resetAll={handleResetLuggage}
                checkAll={handleCheckAllLuggage}
              />
            </div>
          )}

          {activeTab === "basic" && (
            <div className="animate-fade-in duration-300">
              <BasicInfoTab />
            </div>
          )}

          {activeTab === "translator" && (
            <div className="animate-fade-in duration-300">
              <TranslatorTab
                phrases={phrases}
                addPhrase={handleAddPhrase}
                deletePhrase={handleDeletePhrase}
              />
            </div>
          )}

          {activeTab === "financial" && (
            <div className="animate-fade-in duration-300">
              <FinanceTab
                expenses={expenses}
                exchangeRate={exchangeRate}
                setManualExchangeRate={saveExchangeRate}
              />
            </div>
          )}
        </main>
      </div>

      {/* Decorative Signature Credits - Only visible on desktop sidebars */}
      <div className="hidden lg:block fixed left-10 bottom-10 max-w-xs space-y-2 text-xs text-[#8C7E74] tracking-wide font-serif leading-relaxed">
        <p className="font-bold text-[#3F2B20]">🌻 釜山日和・設計理念</p>
        <p>
          本站採用療癒舒適的奶油文青配色，結合老報紙與文青貼紙排版，打磨專屬釜山的優雅夏日。
        </p>
        <p className="font-sans text-[10px] uppercase font-mono tracking-wider opacity-60">
          Designed with love for Google AI Studio.
        </p>
      </div>
    </div>
  );
}

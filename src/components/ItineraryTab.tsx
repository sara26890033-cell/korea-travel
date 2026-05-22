/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ItinerarySpot, ExpenseRecord, DailyItinerary } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Plus,
  Trash2,
  Wallet,
  Coins,
  ChevronDown,
  ChevronUp,
  SquareDot,
  Copy,
  Check,
  Footprints,
  FileEdit,
  Flame
} from "lucide-react";

interface ItineraryTabProps {
  itinerary: DailyItinerary[];
  expenses: ExpenseRecord[];
  addExpense: (spotId: string, day: number, amount: number, description: string) => void;
  deleteExpense: (id: string) => void;
  exchangeRate: number; // KRW to TWD multiplier, e.g., 0.024
}

// Safe expression evaluator for simple calculators
function safeEvaluate(expr: string): string {
  try {
    // Restricts string characters to only math components for safety
    const sanitized = expr.replace(/[^0-9+\-*/.]/g, "");
    if (!sanitized) return "";
    const result = new Function(`return (${sanitized})`)();
    if (result !== undefined && !isNaN(result) && isFinite(result)) {
      return Math.round(result).toString();
    }
  } catch (e) {
    // Return original expression if incomplete
  }
  return expr;
}

// Structured, high-quality offline translation mapper for Busan itinerary
function getSpotKorean(spot: ItinerarySpot): string {
  const lookup: Record<string, string> = {
    "d1-s1": "김해국제공항",
    "d1-s2": "해운대 방향 택시 승차",
    "d1-s3": "트레블로지 스위트 부산 센텀",
    "d2-s1": "워킹홀리데이 (Working Holiday)",
    "d2-s2": "광복로 패션거리 (南浦洞時尚街)",
    "d2-s3": "목구멍 (釜蓋五花肉)",
    "d2-s4": "부평깡통시장 (富平罐頭市場)",
    "d2-s5": "국제시장 (Gukje Market)",
    "d2-s6": "송도해상케이블카",
    "d2-s7": "호텔 복귀 및 휴식",
    "d3-s1": "수변최고돼지국밥",
    "d3-s2": "홈플러스 센텀시提點",
    "d3-s3": "해리단길 (Haeridan-gil)",
    "d3-s4": "맛찬들왕소금구이 (味贊王烤肉)",
    "d3-s5": "청사포역 (灌籃高手平交道)",
    "d3-s6": "",
    "d3-s7": "자연도소금빵 (鹽麵包)",
    "d3-s8": "해운대 해수욕장 (沙灘散步)",
    "d3-s9": "해운대 전통시장 (美食街)",
    "d3-s10": "호텔 복귀及休息",
    "d4-s1": "호텔 체크아웃 (行李大整理)",
    "d4-s2": "공항 택시 탑勝",
    "d4-s3": "김해국제공항 (退稅與託運)",
    "d4-s4": "티웨이항공 (德威返台航班)",
    "d4-s5": "가오슝國際機場抵達",
  };
  
  if (lookup[spot.id]) return lookup[spot.id];
  
  // Regex fallback: Extract first set of characters in Korean block
  const titleMatch = spot.title.match(/[\uac00-\ud7af]+/);
  if (titleMatch) return titleMatch[0];
  return "";
}

// Dynamic transit connector pills to display BETWEEN specific attractions
const transitConnectors: Record<string, string> = {
  "d1-s1": "🚕 計程車 (車程約 30 分鐘)",
  "d2-s1": "🚕 計程車 (車程約 30 分鐘)",
  "d2-s2": "🚶 步行 (約 3 分鐘)",
  "d2-s3": "🚶 步行 (約 5 分鐘)",
  "d2-s5": "🚕 計程車 (車程約 15 分鐘)",
  "d2-s6": "🚕 計程車 (車程約 25 分鐘)",
  "d3-s1": "🚶 步行 (約 5 分鐘)",
  "d3-s2": "🚕 計程車 (車程約 15 分鐘)",
  "d3-s3": "🚶 步行",
  "d3-s4": "🚕 計程車 (車程約 15 分鐘)",
  "d3-s5": "🚃 天空膠囊列車 (車程 30 分鐘)",
  "d3-s7": "🚶 沿著海灘散步(約13分鐘)",
  "d3-s8": "🚶 步行 (約 5 分鐘)",
  "d4-s1": "🚕 計程車 (車程約 35 分鐘)"
};

export function ItineraryTab({
  itinerary,
  expenses,
  addExpense,
  deleteExpense,
  exchangeRate
}: ItineraryTabProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isRainyDay, setIsRainyDay] = useState<boolean>(false);
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keypad popup toggle state
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);

  // Unified expense inputs representing "今日花費" at bottom
  const [expenseDesc, setExpenseDesc] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");

  // Stateful day journal/notes box
  const [dayNotes, setDayNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("busan_day_notes");
    return saved ? JSON.parse(saved) : {};
  });

  const currentDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleNoteChange = (text: string) => {
    const updated = { ...dayNotes, [selectedDay]: text };
    setDayNotes(updated);
    localStorage.setItem("busan_day_notes", JSON.stringify(updated));
  };

  const handleKeypadPress = (key: string) => {
    if (key === "C") {
      setExpenseAmount("");
    } else if (key === "backspace") {
      setExpenseAmount((prev) => (prev.length > 0 ? prev.slice(0, -1) : ""));
    } else if (key === "=") {
      setExpenseAmount((prev) => safeEvaluate(prev));
    } else if (["+", "-", "*", "/"].includes(key)) {
      setExpenseAmount((prev) => {
        const lastChar = prev.slice(-1);
        if (["+", "-", "*", "/"].includes(lastChar)) {
          return prev.slice(0, -1) + key;
        }
        return prev + key;
      });
    } else {
      setExpenseAmount((prev) => prev + key);
    }
  };

  // Get ALL expenses logged for the current active day
  const getTodayExpenses = () => {
    return expenses.filter((e) => e.day === selectedDay);
  };

  const getTodayTotalKRW = () => {
    return getTodayExpenses().reduce((sum, e) => sum + e.amount, 0);
  };

  // Confirm and submit a new expense record
  const handleConfirmAdd = () => {
    const solved = safeEvaluate(expenseAmount);
    if (!expenseDesc.trim()) return;
    const amountNum = parseFloat(solved);
    if (isNaN(amountNum) || amountNum <= 0) return;

    addExpense("other", selectedDay, amountNum, expenseDesc);
    setExpenseDesc("");
    setExpenseAmount("");
    setIsKeypadOpen(false);
  };

  // Click "+ 新增" / "新增一筆" to load inputs or set default focus
  const handleAddNewRecord = () => {
    setExpenseDesc("");
    setExpenseAmount("");
    const inputElement = document.getElementById("expense-desc-input");
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Clear current inputs in response to Trash icon next to input
  const handleClearInputs = () => {
    setExpenseDesc("");
    setExpenseAmount("");
    setIsKeypadOpen(false);
  };

  // Remove taxi transit items from attractions cards because they are rendered as inline pills!
  const visibleSpots = currentDayData.spots.filter(
    (spot) => spot.id !== "d1-s2" && spot.id !== "d4-s2"
  );

  return (
    <div className="space-y-4.5 pb-2">
      {/* 文青日曆選擇器 - 整合雨備方案 */}
      <div className="flex bg-[#FFFDF9] rounded-2xl p-1.5 border border-[#E8E1D5] shadow-xs select-none gap-1">
        {itinerary.map((dayData) => (
          <button
            key={dayData.day}
            id={`day-select-btn-${dayData.day}`}
            onClick={() => {
              setSelectedDay(dayData.day);
              setIsRainyDay(false);
              setExpandedSpotId(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
              selectedDay === dayData.day && !isRainyDay
                ? "bg-[#768A7A] text-[#FAF6EE] font-medium shadow-xs"
                : "text-[#8C7E74] hover:text-[#A47551] hover:bg-[#FAF5EB]"
            }`}
          >
            <div className="text-[11px] font-bold">DAY {dayData.day}</div>
            <div className="text-[9px] opacity-80">{dayData.date.replace("（", "").replace("）", "").split("（")[0]}</div>
          </button>
        ))}
        {/* 雨備方案按鈕 */}
        <button
          onClick={() => {
            setIsRainyDay(true);
            setExpandedSpotId(null);
          }}
          className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer flex flex-col justify-center items-center ${
            isRainyDay
              ? "bg-[#8C7E74] text-[#FAF6EE] font-medium shadow-xs animate-pulse-subtle"
              : "text-[#8C7E74] hover:text-[#A47551] hover:bg-[#FAF5EB]"
          }`}
        >
          <div className="text-[11px] font-bold">🌧️ 雨備</div>
          <div className="text-[9px] opacity-80">室內備案</div>
        </button>
      </div>

      {/* 📅 日程或雨備標題 / 緊接特定地圖連結 */}
      <div className="flex items-center justify-between px-1 select-none w-full gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl" role="img" aria-label="calendar">
            {isRainyDay ? "☔" : "🗓️"}
          </span>
          <h2 className="font-serif font-black text-base sm:text-lg text-[#3F2B20]">
            {isRainyDay ? "雨備方案" : (
              <>
                {selectedDay === 1 && "第一天：抵達釜山"}
                {selectedDay === 2 && "第二天：南浦購物及海景"}
                {selectedDay === 3 && "第三天：海雲台與膠囊火車"}
                {selectedDay === 4 && "第四天：返台行程"}
              </>
            )}
          </h2>
        </div>
        
        {/* 南浦洞 / 海雲台 地圖捷徑 - 靠右對齊 (僅在對應天數顯示) */}
        {!isRainyDay && selectedDay === 2 && (
          <a
            href="https://naver.me/G3v8mPZS"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 px-2.5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] text-[#768A7A] text-[11px] font-black rounded-xl transition-all h-8 flex items-center justify-center gap-1 shadow-3xs cursor-pointer ml-auto shrink-0"
          >
            <span>👛 南浦地圖</span>
          </a>
        )}
        {!isRainyDay && selectedDay === 3 && (
          <a
            href="https://naver.me/xjYgGPQF"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 px-2.5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] text-[#768A7A] text-[11px] font-black rounded-xl transition-all h-8 flex items-center justify-center gap-1 shadow-3xs cursor-pointer ml-auto shrink-0"
          >
            <span>🌊 海雲地圖</span>
          </a>
        )}
      </div>

      {isRainyDay ? (
        /* 🌦️ 雨備方案美觀排版 */
        <div className="space-y-4 pt-1 animate-fade-in select-text">
          {/* 所有景點總覽地圖一併放入同一頁面 */}
          <div className="bg-gradient-to-br from-[#E2ECE5] to-[#D5E1D8]/25 border border-[#D5E1D8] rounded-2xl p-4.5 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1 select-none">
              <h3 className="font-sans font-black text-sm text-[#2E4535] flex items-center gap-1.5 leading-none">
                <span className="text-base">📌</span>
                所有景點總覽地圖 (Naver Map)
              </h3>
              <p className="text-[11px] text-[#547963] font-semibold">
                已收錄本次釜山行全部景點與室內雨備點，點擊可在 Naver Map 輕鬆瀏覽！
              </p>
            </div>
            <a
              href="https://naver.me/xEX6HEsE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-2.5 px-4 bg-[#768A7A] hover:bg-[#5E7062] text-white text-xs font-black rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <span>🗺️ 開啟景點總覽地圖</span>
            </a>
          </div>

          {/* 雨備實案分類卡片 */}
          <div className="space-y-4">
            {/* 放鬆休息耍廢 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm space-y-3">
              <div className="flex items-center gap-2 select-none">
                <span className="text-xl">🧖‍♀️</span>
                <h3 className="font-serif font-black text-base text-[#3F2B20]">放鬆休息耍廢</h3>
              </div>
              <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-1.5">
                <h4 className="text-sm font-black text-[#8D5B4C]">汗蒸幕 (Jjimjilbang / New Spa Land)</h4>
                <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                  放鬆身心熱呼呼，舒緩旅途疲憊！強烈首推新世界百貨的 Spa Land，擁有超豪華長型溫泉、戶外足浴與豐富桑拿房，絕對是雨天的最高首選享受。
                </p>
              </div>
            </div>

            {/* 逛街採購 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 select-none">
                <span className="text-xl">🛍️</span>
                <h3 className="font-serif font-black text-base text-[#3F2B20]">逛街採購行程</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-1.5">
                  <h4 className="text-xs font-extrabold tracking-widest px-2 py-0.5 rounded bg-[#EBE5DA] text-[#8C7E74] inline-block mb-1">
                    服飾彩妝挖寶
                  </h4>
                  <h4 className="text-sm font-black text-[#8D5B4C]">西面地下街</h4>
                  <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                    釜山最大型的地下潮流街，聚集無數平價韓系服飾、精品配件與人氣彩妝，雨再大也能盡情挑選挖寶，完全不受氣候干擾。
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-1.5">
                  <h4 className="text-xs font-extrabold tracking-widest px-2 py-0.5 rounded bg-[#EBE5DA] text-[#8C7E74] inline-block mb-1">
                    潮流品牌與餐廳一站式搞定
                  </h4>
                  <h4 className="text-sm font-black text-[#8D5B4C]">新世界百貨 (Shinsegae)</h4>
                  <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                    榮登吉尼斯紀錄之最大型百貨公司！各大韓國當紅設計師品牌（如 Rest & Recreation、Matin Kim）、國際精品及豐富精美的美食餐廳一網打盡。
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-1.5">
                  <h4 className="text-xs font-extrabold tracking-widest px-2 py-0.5 rounded bg-[#EBE5DA] text-[#8C7E74] inline-block mb-1">
                    百貨與超市一次滿足
                  </h4>
                  <h4 className="text-sm font-black text-[#8D5B4C]">樂天百貨 & 超市 (Lotte)</h4>
                  <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                    地下通道直連捷運站！購物與伴手禮零食採買一次搞定，不用撐傘即可購買大箱韓式拉麵、海苔伴手禮直接搬回飯店。
                  </p>
                </div>
              </div>
            </div>

            {/* 肚子空空 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm space-y-3">
              <div className="flex items-center gap-2 select-none">
                <span className="text-xl">😋</span>
                <h3 className="font-serif font-black text-base text-[#3F2B20]">肚子空空推薦</h3>
              </div>
              <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-1.5">
                <h4 className="text-sm font-black text-[#8D5B4C]">室內暖胃烤肉餐廳 & 絕美海景玻璃窗咖啡廳</h4>
                <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                  雨天最適合躲在室內大啖香氣四溢的韓式烤肉、蔘雞湯，或是前往海雲台、廣安里挑選一家臨窗海景咖啡廳，聽著雨聲配拿鐵與舒芙蕾甜點。
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 景點時間流 */}
          <div className="space-y-3.5 relative border-l border-dashed border-[#E8E1D5]/70 pl-3.5 py-0.5 ml-2">
        {visibleSpots.map((spot) => {
          const isExpanded = expandedSpotId === spot.id;
          const koreanTrans = getSpotKorean(spot);

          return (
            <React.Fragment key={spot.id}>
              {/* Attraction Card Container */}
              <div
                onClick={() => setExpandedSpotId(isExpanded ? null : spot.id)}
                className={`relative bg-[#FFFDF9] rounded-2xl p-4.5 border transition-all duration-300 shadow-xs cursor-pointer select-none ${
                  isExpanded 
                    ? "border-[#768A7A] ring-1 ring-[#768A7A]/20 bg-[#FFFDF9]/95 scale-[1.01]" 
                    : "border-[#E8E1D5]/70 hover:border-[#768A7A]/60"
                }`}
              >
                {/* Timeline dot decoration */}
                <div className="absolute -left-[20px] top-7.5 w-2.5 h-2.5 rounded-full bg-[#FAF5EB] border-2 border-[#768A7A] transition-transform" />

                {/* Header section (Time Badge on Left, Collapse text on Right) */}
                <div className="flex items-center justify-between gap-2.5 select-none text-xs">
                  <span className="inline-block text-[11px] font-bold font-sans text-gray-500 bg-gray-100 rounded-full px-3 py-1 font-mono">
                    {spot.time}
                  </span>
                  <div className="text-[11px] font-bold text-[#8C7E74] flex items-center gap-0.5">
                    {isExpanded ? (
                      <span className="text-[#768A7A] flex items-center gap-1">📘 點擊收起</span>
                    ) : (
                      <span className="flex items-center gap-1">🔎 點擊展開</span>
                    )}
                  </div>
                </div>

                {/* Title & Description under time badge (matches image 1) */}
                <div className="mt-2.5 space-y-1.5">
                  <h4 className="text-base font-bold text-[#3F2B20] leading-snug break-words">
                    {spot.title}
                  </h4>
                  {spot.purpose && (
                    <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
                      {spot.purpose}
                    </p>
                  )}
                </div>

                {/* Expanded details panel layout */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()} // Stop bubble up so clicks inside don't collapse card
                    className="mt-3.5 pt-3.5 border-t border-[#E8E1D5]/40 space-y-3.5 animate-fade-in cursor-default select-text"
                  >
                    {/* Specialized custom display conditional for fried chicken spot (d1-s4) */}
                    {spot.id === "d1-s4" ? (
                      <div className="space-y-3.5">
                        <div className="text-xs font-black text-[#A47551] select-none flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>🍗 炸雞品牌推薦與韓文關鍵字：</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5">
                          {/* PURADAK */}
                          <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#E8E1D5]/40 flex items-center justify-between gap-2.5 shadow-3xs">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-[#3F2B20]">PURADAK 炸雞</div>
                              <div className="text-[10px] text-gray-500 font-mono">
                                韓文店名: <span className="text-[#8D5B4C] font-bold">푸라닭치킨</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText("푸라닭치킨", "puradak")}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#8C7E74] hover:text-[#A47551] bg-white border border-[#E8E1D5] hover:bg-gray-50 rounded-lg transition-all cursor-pointer shadow-3xs shrink-0"
                            >
                              {copiedId === "puradak" ? "已複製 ✔" : "複製韓文"}
                            </button>
                          </div>

                          {/* 60계치킨 */}
                          <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#E8E1D5]/40 flex items-center justify-between gap-2.5 shadow-3xs">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-[#3F2B20]">60雞炸雞 (60炸雞)</div>
                              <div className="text-[10px] text-gray-500 font-mono">
                                韓文店名: <span className="text-[#8D5B4C] font-bold">60계치킨</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText("60계치킨", "60chicken")}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#8C7E74] hover:text-[#A47551] bg-white border border-[#E8E1D5] hover:bg-gray-50 rounded-lg transition-all cursor-pointer shadow-3xs shrink-0"
                            >
                              {copiedId === "60chicken" ? "已複製 ✔" : "複製韓文"}
                            </button>
                          </div>
                        </div>

                        {spot.notes && spot.notes.length > 0 && (
                          <div className="space-y-1.5 pt-1.5 border-t border-[#E8E1D5]/35">
                            <div className="text-[10px] text-[#8C7E74] font-bold tracking-wider uppercase">隨行攻略 / 注意事項</div>
                            <ul className="space-y-1.5 bg-[#FFFDF9]/40 p-3 rounded-xl border border-[#E8E1D5]/30">
                              {spot.notes.map((note, index) => (
                                <li key={index} className="text-xs text-[#5C534C] flex items-start gap-1.5 leading-relaxed">
                                  <span className="text-[#A47551] mt-1 shrink-0 text-[10px]">•</span>
                                  <span className="select-text">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : spot.id === "d2-s2" ? (
                      /* Specialized custom page rendering for Guangfu street details */
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-xs bg-[#FAF5EB]/60 p-2.5 rounded-xl border border-[#E8E1D5]/35">
                          <span className="font-bold text-[#3F2B20] font-sans">南浦站 7 號出口開逛</span>
                          <a
                            href="https://naver.me/xNLXIkNq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-3 bg-[#768A7A] hover:bg-[#5C7060] text-[#FAF6EE] text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
                          >
                            <span>🗺️ 導航起點</span>
                          </a>
                        </div>

                        <div className="bg-[#FFFDF9] rounded-xl border border-[#E8E1D5] p-3.5 space-y-3 shadow-3xs">
                          <div className="text-xs font-black text-[#A47551] flex items-center gap-1 select-none">
                            <span>✨ 推薦目的地：</span>
                          </div>

                          <div className="divide-y divide-[#E8E1D5]/40 text-xs text-xs">
                            <div className="py-2.5 flex items-center justify-between gap-2 first:pt-0">
                              <span className="font-medium text-[#3F2B20]">👗 WHO.A.U / SPAO / 8 Seconds / Wonder Place / the north face</span>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-medium text-[#3F2B20]">🎨 ARTBOX (文具雜貨伴手禮)</span>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-medium text-[#3F2B20]">🏠 大創 (3層樓旗艦店)</span>
                              <a
                                href="https://naver.me/x0UABelr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-bold text-[#A47551] hover:underline shrink-0"
                              >
                                地圖 ➔
                              </a>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-medium text-[#3F2B20]">🥜 HBAF 杏仁果專賣店</span>
                              <a
                                href="https://naver.me/GRoZoJ5K"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-bold text-[#A47551] hover:underline shrink-0"
                              >
                                地圖 ➔
                              </a>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-medium text-[#3F2B20]">🥞 BIFF 廣場 & 元祖糖餅</span>
                              <a
                                href="https://naver.me/FDnCfOLW"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-bold text-[#A47551] hover:underline shrink-0"
                              >
                                地圖 ➔
                              </a>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-medium text-[#3F2B20]">💄 Olive Young (大間門市)</span>
                              <a
                                href="https://naver.me/x8tpgm68"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-bold text-[#A47551] hover:underline shrink-0"
                              >
                                地圖 ➔
                              </a>
                            </div>

                            <div className="py-2.5 flex items-center justify-between gap-2 last:pb-0">
                              <span className="font-medium text-[#3F2B20]">💊 藥局 (保健品採買)</span>
                              <a
                                href="https://naver.me/F42MYkSY"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11.5px] font-bold text-[#A47551] hover:underline shrink-0"
                              >
                                地圖 ➔
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* General expanded layout: enclosed Map Link, KR translation, and address */
                      <div className="space-y-3.5">
                        {/* Map trigger button */}
                        {spot.naverMapUrl && (
                          <div className="flex justify-end pr-0.5">
                            <a
                              href={spot.naverMapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1 px-3 bg-[#FAF5EB]/60 hover:bg-[#768A7A]/15 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#768A7A] text-xs font-semibold rounded-lg flex items-center gap-1 transition-all shadow-3xs cursor-pointer"
                            >
                              <span>🗺️ 地圖導航</span>
                            </a>
                          </div>
                        )}

                        {/* Enclosed translation and details box (Image 2 style) */}
                        {(koreanTrans || spot.address) && (
                          <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#E8E1D5]/45 space-y-2.5">
                            {koreanTrans && (
                              <div className="flex items-center justify-between gap-2.5">
                                <div className="text-xs flex items-center gap-1 text-[#5C534C] min-w-0 flex-1">
                                  <span className="font-bold text-gray-400 font-mono tracking-tighter mr-1">KR</span>
                                  <span className="font-bold shrink-0">韓文名稱：</span>
                                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E1D5]/35 text-[#3F2B20] font-bold select-all overflow-hidden text-ellipsis whitespace-nowrap">
                                    {koreanTrans}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(koreanTrans, `kor-${spot.id}`)}
                                  className="px-2 py-1 text-[11px] font-bold text-[#8C7E74] hover:text-[#A47551] bg-white border border-[#E8E1D5] hover:bg-gray-50 rounded-lg transition-all cursor-pointer shadow-3xs shrink-0"
                                >
                                  {copiedId === `kor-${spot.id}` ? "已複製 ✔" : "複製"}
                                </button>
                              </div>
                            )}

                            {spot.address && (
                              <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-[#E8E1D5]/35">
                                <div className="text-[11.5px] flex-1 min-w-0 flex items-start gap-1 text-[#5C534C]">
                                  <span className="text-red-500 shrink-0">📍</span>
                                  <span className="font-bold shrink-0">地址：</span>
                                  <span className="font-mono text-[#3F2B20] break-all select-all font-semibold leading-relaxed">
                                    {spot.address}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(spot.address!, `addr-${spot.id}`)}
                                  className="px-2 py-1 text-[11px] font-bold text-[#8C7E74] hover:text-[#A47551] bg-white border border-[#E8E1D5] hover:bg-gray-50 rounded-lg transition-all cursor-pointer shadow-3xs shrink-0"
                                >
                                  {copiedId === `addr-${spot.id}` ? "已複製 ✔" : "複製"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bullets notes */}
                        {spot.notes && spot.notes.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[10px] text-[#8C7E74] font-bold tracking-wider uppercase">隨行攻略 / 注意事項</div>
                            <ul className="space-y-1.5 bg-[#FFFDF9]/40 p-3 rounded-xl border border-[#E8E1D5]/30">
                              {spot.notes.map((note, index) => (
                                <li key={index} className="text-xs text-[#5C534C] flex items-start gap-1.5 leading-relaxed">
                                  <span className="text-[#A47551] mt-1 shrink-0 text-[10px]">•</span>
                                  <span className="select-text">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interstitial Transit Pill (Omission of separate cards, rendered dynamically between spots) */}
              {transitConnectors[spot.id] && (
                <div className="flex justify-center my-3.5 mx-auto w-full select-none">
                  <div className="flex items-center justify-center bg-[#FFFDF9] border border-[#DCD5C9] rounded-full py-2 px-5 text-[13px] sm:text-[14px] text-[#8D5B4C] font-black tracking-wide shadow-2xs hover:border-[#768A7A]/40 transition-colors">
                    {transitConnectors[spot.id]}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 📝 Bookkeeping Card placed AT THE BOTTOM of the itinerary view */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-4.5 mt-4 select-text">
        
        {/*當日備忘/行程心得記備 */}
        <div className="space-y-1.5">
          <div className="text-sm font-bold text-[#8D5B4C] flex items-center gap-1.5 select-none font-sans">
            <span>📝 當日備忘/行程心得記備：</span>
          </div>
          <textarea
            value={dayNotes[selectedDay] || ""}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="記錄此日的點滴、重要提醒，或搭車心情..."
            className="w-full h-20 text-sm bg-white border border-[#E8E1D5]/60 rounded-2xl p-3.5 text-[#3F2B20] placeholder-[#BFB3A8] focus:outline-none focus:border-[#768A7A] focus:ring-1 focus:ring-[#768A7A]/10 font-medium resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
          />
        </div>

        {/* 💳 Bookkeeping Inputs styled exactly after Image 2 */}
        <div className="pt-3 border-t border-dashed border-[#E8E1D5] space-y-3.5">
          <div className="flex justify-between items-center select-none">
            <span className="text-base font-extrabold text-[#A47551]">
              今日花費
            </span>
            <button
              type="button"
              onClick={handleAddNewRecord}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#FAF6EE] bg-[#768A7A] hover:bg-[#5C7060] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增一筆</span>
            </button>
          </div>

          {/* Form Row with Enriched input and purple check, trash bin actions */}
          <div className="flex items-center gap-1.5 w-full">
            <input
              id="expense-desc-input"
              type="text"
              placeholder="花費項目"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              className="w-24 flex-1 min-w-0 text-xs bg-white border border-[#E8E1D5] rounded-xl px-2.5 py-2 text-[#3F2B20] placeholder-[#BFB3A8] focus:outline-none focus:border-[#768A7A] font-medium shadow-2xs"
            />
            <div className="relative w-24 shrink-0">
              <input
                id="expense-amount-input"
                type="text"
                inputMode="none" // blocks virtual keyboard popup on mobile completely
                placeholder="韓元"
                value={expenseAmount}
                onFocus={() => setIsKeypadOpen(true)}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9+\-*/.]/g, "");
                  setExpenseAmount(clean);
                }}
                className="w-full text-xs font-bold bg-white border border-[#E8E1D5] rounded-xl pl-2 pr-6 py-2 text-[#3F2B20] text-right focus:outline-none focus:border-[#768A7A] placeholder-[#BFB3A8] font-mono shadow-2xs"
                style={{ appearance: "none" }} // fully removes spinner controllers / arrows
              />
              <span className="absolute right-2 top-1.5 text-[11px] text-[#8C7E74] font-mono select-none">₩</span>
            </div>
            
            {/* Purplish Action Buttons */}
            <button
              type="button"
              onClick={handleConfirmAdd}
              className="h-9 w-9 flex items-center justify-center text-[#7251B5] bg-[#7251B5]/10 hover:bg-[#7251B5]/25 hover:text-[#7251B5] active:scale-95 rounded-xl transition-all shadow-3xs shrink-0 cursor-pointer"
              title="打勾確認此筆記帳"
            >
              <Check className="w-4 h-4 font-bold" />
            </button>
            <button
              type="button"
              onClick={handleClearInputs}
              className="h-9 w-9 flex items-center justify-center text-gray-500 bg-gray-50 border border-[#E8E1D5]/60 hover:bg-gray-100 active:scale-95 rounded-xl transition-all hover:text-gray-700 shrink-0 cursor-pointer"
              title="清除填寫"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* CUSTOM CALCULATOR NUMERIC KEYPAD WITH ARITHMETIC OPERATORS (Image inspired) */}
          <AnimatePresence>
            {isKeypadOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-[#FAF5EB] p-3 rounded-2xl border border-[#E2D9C8] space-y-2.5 shadow-sm"
              >
                {/* Visual Output Line inside keypad */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-white rounded-xl border border-[#E9E1D5] text-sm font-mono font-black text-[#3F2B20]">
                  <span className="text-[#8C7E74] select-none font-sans text-xs sm:text-sm">目前算式：</span>
                  <span className="text-base sm:text-lg tracking-wide text-[#768A7A] font-extrabold max-w-xs overflow-x-auto whitespace-nowrap">
                    {expenseAmount || "0"}
                  </span>
                </div>

                {/* 4x4 Grid Buttons */}
                <div className="grid grid-cols-4 gap-1.5 text-lg sm:text-xl font-extrabold font-mono select-none">
                  {/* Row 1 */}
                  <button type="button" onClick={() => handleKeypadPress("7")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">7</button>
                  <button type="button" onClick={() => handleKeypadPress("8")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">8</button>
                  <button type="button" onClick={() => handleKeypadPress("9")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">9</button>
                  <button type="button" onClick={() => handleKeypadPress("/")} className="py-3 bg-[#F0EAE1] hover:bg-[#A47551]/10 text-[#A47551] text-lg sm:text-xl font-extrabold rounded-lg border border-[#DCD5C9] active:scale-95 transition-transform cursor-pointer">÷</button>

                  {/* Row 2 */}
                  <button type="button" onClick={() => handleKeypadPress("4")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">4</button>
                  <button type="button" onClick={() => handleKeypadPress("5")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">5</button>
                  <button type="button" onClick={() => handleKeypadPress("6")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">6</button>
                  <button type="button" onClick={() => handleKeypadPress("*")} className="py-3 bg-[#F0EAE1] hover:bg-[#A47551]/10 text-[#A47551] text-lg sm:text-xl font-extrabold rounded-lg border border-[#DCD5C9] active:scale-95 transition-transform cursor-pointer">×</button>

                  {/* Row 3 */}
                  <button type="button" onClick={() => handleKeypadPress("1")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">1</button>
                  <button type="button" onClick={() => handleKeypadPress("2")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">2</button>
                  <button type="button" onClick={() => handleKeypadPress("3")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">3</button>
                  <button type="button" onClick={() => handleKeypadPress("-")} className="py-3 bg-[#F0EAE1] hover:bg-[#A47551]/10 text-[#A47551] text-lg sm:text-xl font-extrabold rounded-lg border border-[#DCD5C9] active:scale-95 transition-transform cursor-pointer">-</button>

                  {/* Row 4 */}
                  <button type="button" onClick={() => handleKeypadPress("C")} className="py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 active:scale-95 transition-transform cursor-pointer font-sans text-sm sm:text-base font-black">清除</button>
                  <button type="button" onClick={() => handleKeypadPress("0")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform cursor-pointer">0</button>
                  <button type="button" onClick={() => handleKeypadPress("backspace")} className="py-3 bg-white hover:bg-[#FAF5EB]/50 text-[#3F2B20] text-lg sm:text-xl font-extrabold rounded-lg border border-[#E8E1D5]/60 active:scale-95 transition-transform flex items-center justify-center cursor-pointer">⌫</button>
                  <button type="button" onClick={() => handleKeypadPress("+")} className="py-3 bg-[#F0EAE1] hover:bg-[#A47551]/10 text-[#A47551] text-lg sm:text-xl font-extrabold rounded-lg border border-[#DCD5C9] active:scale-95 transition-transform cursor-pointer">+</button>
                </div>

                {/* Confirm Check & Evaluate Control Row */}
                <div className="flex gap-2 text-sm sm:text-base font-black select-none">
                  <button
                    type="button"
                    onClick={() => handleKeypadPress("=")}
                    className="flex-2 py-3 bg-[#E8E1D5] hover:bg-[#E2D9C8] text-[#3F2B20] rounded-xl border border-[#D4C9B6] active:scale-95 transition-all cursor-pointer font-sans text-xs sm:text-sm font-black"
                  >
                    ＝ 計算
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const finalSum = safeEvaluate(expenseAmount);
                      setExpenseAmount(finalSum);
                      
                      // Auto-conclude and submit if name exists
                      if (expenseDesc.trim()) {
                        const finalNum = parseFloat(finalSum);
                        if (!isNaN(finalNum) && finalNum > 0) {
                          addExpense("other", selectedDay, finalNum, expenseDesc);
                          setExpenseDesc("");
                          setExpenseAmount("");
                          setIsKeypadOpen(false);
                          return;
                        }
                      }
                      
                      // Just output computed sum to field if title wasn't pre-filled
                      setIsKeypadOpen(false);
                    }}
                    className="flex-2 py-3 bg-[#7251B5] hover:bg-[#5E3EA1] text-white rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-3xs font-sans font-black text-xs sm:text-sm"
                  >
                    <span>✔ 確定勾選</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsKeypadOpen(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-500 rounded-xl border border-[#E8E1D5] active:scale-95 transition-all text-xs sm:text-sm font-bold shrink-0 cursor-pointer font-sans"
                  >
                    關閉
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick preset keywords tags */}
          <div className="flex flex-wrap gap-1 select-none">
            {["計程車", "外送", "門票"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setExpenseDesc(cat)}
                className="text-[11px] text-[#8C7E74] hover:text-[#FAF6EE] bg-[#FAF5EB] hover:bg-[#768A7A] px-2.5 py-1 rounded-lg transition-colors border border-[#E8E1D5]/35 cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Inline Conversion Assist */}
          {expenseAmount && !isNaN(parseFloat(safeEvaluate(expenseAmount))) && (
            <div className="text-xs text-[#8D5B4C] text-right font-semibold pr-1">
              估計約 NT$ {Math.round(parseFloat(safeEvaluate(expenseAmount)) * exchangeRate).toLocaleString()}
            </div>
          )}

          {/* Detailed Itemization Scroll List */}
          {getTodayExpenses().length > 0 ? (
            <div className="pt-2.5 space-y-1.5 border-t border-[#E8E1D5]/35">
              <div className="text-[10px] text-[#8C7E74] font-bold tracking-wider uppercase select-none font-sans">今日花費歷史紀錄:</div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {getTodayExpenses().map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between text-xs text-[#3F2B20] bg-white px-3.5 py-2.5 rounded-xl border border-[#E8E1D5]/40 shadow-3xs hover:border-[#768A7A]/30 transition-all select-none"
                  >
                    <span className="font-bold text-[#3F2B20]">{exp.description}</span>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[#8C7E74] font-semibold">{exp.amount.toLocaleString()} ₩</span>
                      <span className="text-[10px] text-gray-400 font-mono">(≈ NT${Math.round(exp.amount * exchangeRate)})</span>
                      
                      {/* Check and trash icons on item row */}
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button
                          type="button"
                          onClick={() => deleteExpense(exp.id)}
                          className="h-7.5 w-7.5 flex items-center justify-center text-[#7251B5] bg-[#7251B5]/5 hover:bg-[#7251B5]/15 rounded-lg transition-colors cursor-pointer"
                          title="打勾項目"
                        >
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExpense(exp.id)}
                          className="h-7.5 w-7.5 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          title="刪除項目"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-[#8C7E74] italic select-none">
              目前此日尚無任何花費明細記錄
            </div>
          )}

          {/* 📅 當日總消費結算 block styled EXACTLY after Image 2 */}
          <div className="bg-[#FAF5EB]/50 rounded-2xl p-4.5 border border-[#E8E1D5]/65 flex flex-col items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] select-none">
            <div className="text-[11px] text-[#8C7E74] font-bold tracking-wider uppercase">當日總消費結算</div>
            <div className="text-2xl font-black text-[#768A7A] mt-1.5 font-sans leading-none">
              {getTodayTotalKRW().toLocaleString()} <span className="text-xs font-normal">KRW</span>
            </div>
            <div className="text-sm font-semibold text-[#8C7E74] mt-1">
              ≈ NT$ {Math.round(getTodayTotalKRW() * exchangeRate).toLocaleString()}
            </div>
          </div>

        </div>
      </div>
        </>
      )}
    </div>
  );
}

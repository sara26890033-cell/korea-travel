/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialExchangeBooths } from "../data";
import { ExpenseRecord } from "../types";
import {
  Coins,
  TrendingUp,
  HelpCircle,
  RefreshCw,
  Wallet,
  Compass,
  ArrowRightLeft,
  ChevronRight,
  TrendingDown,
  Plane,
  ShoppingBag,
  Palmtree
} from "lucide-react";

interface FinanceTabProps {
  expenses: ExpenseRecord[];
  exchangeRate: number; // KRW to TWD, e.g., 0.024
  setManualExchangeRate: (rate: number) => void;
}

// Safe expression evaluator for simple calculators
function safeEvaluate(expr: string): string {
  try {
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

export function FinanceTab({
  expenses,
  exchangeRate,
  setManualExchangeRate
}: FinanceTabProps) {
  const [subTab, setSubTab] = useState<"spending" | "exchange" | "tax">("spending");

  // Converter states
  const [krwInput, setKrwInput] = useState<string>("10000");
  const [twdInput, setTwdInput] = useState<string>((10000 * exchangeRate).toFixed(0));
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);

  const updateTwdFromExpression = (expr: string) => {
    const evaluated = safeEvaluate(expr);
    const num = parseFloat(evaluated);
    if (!isNaN(num)) {
      setTwdInput(Math.round(num * exchangeRate).toString());
    } else {
      setTwdInput("");
    }
  };

  const handleKeypadPress = (key: string) => {
    if (key === "C") {
      setKrwInput("");
      setTwdInput("");
    } else if (key === "backspace") {
      setKrwInput((prev) => {
        const nextVal = prev.length > 0 ? prev.slice(0, -1) : "";
        updateTwdFromExpression(nextVal);
        return nextVal;
      });
    } else if (key === "=") {
      setKrwInput((prev) => {
        const evaluated = safeEvaluate(prev);
        updateTwdFromExpression(evaluated);
        return evaluated;
      });
    } else if (["+", "-", "*", "/"].includes(key)) {
      setKrwInput((prev) => {
        const lastChar = prev.slice(-1);
        let nextVal = prev;
        if (["+", "-", "*", "/"].includes(lastChar)) {
          nextVal = prev.slice(0, -1) + key;
        } else {
          nextVal = prev + key;
        }
        return nextVal;
      });
    } else {
      setKrwInput((prev) => {
        const nextVal = prev + key;
        updateTwdFromExpression(nextVal);
        return nextVal;
      });
    }
  };

  // Live currency status
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [rateSource, setRateSource] = useState<string>("系統緩存預設值 (2026)");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Target budget state
  const dailyBudgetLimit = 150000; // 15萬韓元每日推薦限額

  // Get live exchange rate
  const fetchLiveRate = async () => {
    setIsFetchingRate(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/TWD");
      if (res.ok) {
        const data = await res.json();
        const krwPerTwd = data.rates?.KRW;
        if (krwPerTwd && krwPerTwd > 10 && krwPerTwd < 60) {
          const newRate = 1 / krwPerTwd;
          setManualExchangeRate(newRate);
          setRateSource("歐洲央行全球即時匯率 API");
          setLastUpdated(new Date().toLocaleTimeString());

          // Recalculate input values based on new rate
          const krwNum = parseFloat(krwInput);
          if (!isNaN(krwNum)) {
            setTwdInput(Math.round(krwNum * newRate).toString());
          }
        }
      }
    } catch (e) {
      console.warn("Could not retrieve real-time rate table from remote server. Using fallback local rates.", e);
    } finally {
      setIsFetchingRate(false);
    }
  };

  useEffect(() => {
    fetchLiveRate();
  }, []);

  const handleKrwChange = (val: string) => {
    setKrwInput(val);
    const evaluated = safeEvaluate(val);
    const num = parseFloat(evaluated);
    if (!isNaN(num)) {
      setTwdInput(Math.round(num * exchangeRate).toString());
    } else {
      setTwdInput("");
    }
  };

  const handleTwdChange = (val: string) => {
    setTwdInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && exchangeRate > 0) {
      setKrwInput(Math.round(num / exchangeRate).toString());
    } else {
      setKrwInput("");
    }
  };

  // Financial statistics
  const totalSpentKRW = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSpentTWD = Math.round(totalSpentKRW * exchangeRate);

  const getSubtotalForDay = (dayNum: number) => {
    return expenses.filter((e) => e.day === dayNum).reduce((sum, e) => sum + e.amount, 0);
  };

  // Filter exchange booths by district
  const airportBooths = initialExchangeBooths.filter((b) => b.area === "機場");
  const nampoBooths = initialExchangeBooths.filter((b) => b.area === "南浦洞");
  const haeundaeBooths = initialExchangeBooths.filter((b) => b.area === "海雲台");

  return (
    <div className="space-y-4.5 pb-10">
      {/* 📊 財務助手 3 項子功能導覽列 */}
      <div className="flex bg-[#F0EAE1] rounded-2xl p-1.5 border border-[#DCD5C9] shadow-inner select-none gap-1">
        <button
          onClick={() => setSubTab("spending")}
          className={`flex-1 py-3 text-center text-[12px] sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === "spending"
              ? "bg-[#768A7A] text-[#FAF6EE] shadow-md scale-[1.02]"
              : "text-[#8C7E74] hover:text-[#A47551] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]"
          }`}
        >
          <span>📊 累積消費</span>
        </button>
        <button
          onClick={() => setSubTab("exchange")}
          className={`flex-1 py-3 text-center text-[12px] sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === "exchange"
              ? "bg-[#768A7A] text-[#FAF6EE] shadow-md scale-[1.02]"
              : "text-[#8C7E74] hover:text-[#A47551] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]"
          }`}
        >
          <span>💵 匯率換錢</span>
        </button>
        <button
          onClick={() => setSubTab("tax")}
          className={`flex-1 py-3 text-center text-[12px] sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === "tax"
              ? "bg-[#768A7A] text-[#FAF6EE] shadow-md scale-[1.02]"
              : "text-[#8C7E74] hover:text-[#A47551] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]"
          }`}
        >
          <span>🛍️ 退稅攻略</span>
        </button>
      </div>

      {subTab === "spending" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* 1. 累積消費看板 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs">
            <h3 className="font-serif font-black text-base text-[#3F2B20] mb-4 flex items-center gap-2 border-b border-[#FAF5EB] pb-2 text-[#A47551]">
              <Wallet className="w-5 h-5 text-[#A47551]" />
              旅程累計消費統計
            </h3>

            {/* 總看板 */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#FAF5EB]">
              <div>
                <span className="text-[10px] text-[#8C7E74] tracking-wider font-bold">記帳累計總花費</span>
                <div className="text-2xl font-black text-[#A47551] font-sans">
                  {totalSpentKRW.toLocaleString()} <span className="text-[13px] font-normal text-[#8C7E74]">₩</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C7E74] tracking-wider font-bold">折合台幣總計</span>
                <div className="text-xl font-black text-[#8D5B4C] font-mono">
                  ≈ NT$ {totalSpentTWD.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 每日消費明細 */}
            <div className="mt-4.5 space-y-3.5">
              <h4 className="text-xs font-bold text-[#3F2B20]">每日消費小計明細</h4>
              {[1, 2, 3, 4].map((dayNum) => {
                const daySum = getSubtotalForDay(dayNum);
                const sumPct = Math.min(Math.round((daySum / dailyBudgetLimit) * 100), 100);

                return (
                  <div key={dayNum} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-[#3F2B20]">Day{dayNum} ({dayNum === 1 ? "6/22" : dayNum === 2 ? "6/23" : dayNum === 3 ? "6/24" : "6/25"})</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#8C7E74]">{daySum.toLocaleString()} ₩</span>
                        <span className="text-[10px] text-[#8C7E74] font-medium">
                          (NT$ {Math.round(daySum * exchangeRate).toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* Micro progress visual */}
                    <div className="w-full h-1.5 rounded-full bg-[#FAF5EB] overflow-hidden border border-[#E8E1D5]/20">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          daySum > dailyBudgetLimit ? "bg-[#8D5B4C]" : "bg-[#768A7A]"
                        }`}
                        style={{ width: `${daySum > 0 ? Math.max(sumPct, 6) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {subTab === "exchange" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* 2. 即時匯率換算 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs relative">
            <h3 className="font-serif font-black text-base text-[#3F2B20] mb-2 flex items-center gap-2 text-[#A47551]">
              <Coins className="w-5 h-5 text-[#A47551]" />
              最新即時匯率換算
            </h3>
            <p className="text-xs text-[#8C7E74] mb-4 font-semibold leading-relaxed">
              匯率即時對應台幣轉換。點選重新整理可即時向全球匯率接口刷新數據：
            </p>

            {/* Live status badge */}
            <div className="mb-4 p-2.5 bg-[#FAF5EB] rounded-xl border border-[#E8E1D5]/40 flex items-center justify-between text-[11px] text-[#8C7E74]">
              <div className="space-y-0.5 font-medium">
                <div>當前參考盤口 (1 台幣可換): <span className="font-bold text-[#3F2B20]">{(1 / exchangeRate).toFixed(2)} ₩</span></div>
                <div className="text-[10px] opacity-75">
                  數據來源：{rateSource} {lastUpdated && `(${lastUpdated})`}
                </div>
              </div>

              <button
                id="refresh-rate-btn"
                onClick={fetchLiveRate}
                disabled={isFetchingRate}
                className="p-1.5 text-[#A47551] hover:text-[#FAF6EE] hover:bg-[#A47551] rounded-lg border border-[#A47551]/20 transition-all cursor-pointer disabled:opacity-50"
                title="點擊即時更新最新匯率"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRate ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Inputs stack */}
            <div className="space-y-3.5">
              {/* KRW input */}
              <div className="relative">
                <label className="absolute left-3.5 top-2 text-[10px] font-bold text-[#A47551] tracking-wider uppercase">
                  南韓韓元 (KRW) (點按開啟計算機)
                </label>
                <input
                  id="krw-calc-input"
                  type="text"
                  inputMode="none"
                  placeholder="請輸入或計算韓元..."
                  value={krwInput}
                  onFocus={() => setIsKeypadOpen(true)}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9+\-*/.]/g, "");
                    handleKrwChange(clean);
                  }}
                  className="w-full text-base bg-[#FAF5EB] border border-[#E8E1D5] rounded-xl pl-3.5 pr-14 pt-5 pb-2 text-[#3F2B20] font-mono font-bold focus:outline-none focus:border-[#A47551]"
                />
                <span className="absolute right-4 top-5 font-bold text-xs text-[#8C7E74]">₩ KRW</span>
              </div>

              {/* 貼心計算機介面 */}
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
                        {krwInput || "0"}
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

                    {/* Control Row */}
                    <div className="flex gap-2 text-sm sm:text-base font-black select-none">
                      <button
                        type="button"
                        onClick={() => handleKeypadPress("=")}
                        className="flex-2 py-3 bg-[#E8E1D5] hover:bg-[#E2D9C8] text-[#3F2B20] rounded-xl border border-[#D4C9B6] active:scale-95 transition-all cursor-pointer font-sans text-xs sm:text-sm font-black"
                      >
                        ＝ 計算結果
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const solved = safeEvaluate(krwInput);
                          setKrwInput(solved);
                          updateTwdFromExpression(solved);
                          setIsKeypadOpen(false);
                        }}
                        className="flex-2 py-3 bg-[#A47551] hover:bg-[#8B613F] text-white rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-3xs font-sans font-black text-center text-xs sm:text-sm"
                      >
                        確定轉換
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

              {/* Swap icon decorative divider */}
              <div className="flex justify-center -my-2 select-none relative z-10">
                <div className="bg-[#FFFDF9] border border-[#E8E1D5] rounded-full p-2 text-[#A47551] shadow-xs">
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* TWD input */}
              <div className="relative">
                <label className="absolute left-3.5 top-2 text-[10px] font-bold text-[#A47551] tracking-wider uppercase">
                  臺灣新台幣 (TWD)
                </label>
                <input
                  type="number"
                  placeholder="請輸入台幣..."
                  value={twdInput}
                  onChange={(e) => handleTwdChange(e.target.value)}
                  className="w-full text-base bg-[#FAF5EB] border border-[#E8E1D5] rounded-xl pl-3.5 pr-14 pt-5 pb-2 text-[#3F2B20] font-mono font-bold focus:outline-none focus:border-[#A47551]"
                />
                <span className="absolute right-4 top-5 font-bold text-xs text-[#8C7E74]">$ TWD</span>
              </div>
            </div>

            {/* Quick references cards */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-[#8C7E74]">
              <div className="p-2 bg-[#FAF5EB] rounded-lg border border-[#E8E1D5]/30 flex flex-col justify-center">
                <div className="font-extrabold text-[#3F2B20]">1,000 ₩</div>
                <div className="font-medium whitespace-nowrap">≈ NT$ {Math.round(1000 * exchangeRate)}</div>
              </div>
              <div className="p-2 bg-[#FAF5EB] rounded-lg border border-[#E8E1D5]/30 flex flex-col justify-center">
                <div className="font-extrabold text-[#3F2B20]">10,000 ₩</div>
                <div className="font-medium whitespace-nowrap">≈ NT$ {Math.round(10000 * exchangeRate)}</div>
              </div>
              <div className="p-2 bg-[#FAF5EB] rounded-lg border border-[#E8E1D5]/30 flex flex-col justify-center">
                <div className="font-extrabold text-[#3F2B20]">50,000 ₩</div>
                <div className="font-medium whitespace-nowrap">≈ NT$ {Math.round(50000 * exchangeRate)}</div>
              </div>
            </div>
          </div>

          {/* 3. 特搜推薦換錢所 - 比照圖片設計 */}
          <div className="space-y-4">
            {/* 金海機場 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-4.5 border border-[#E8E1D5] shadow-xs space-y-3 relative">
              <div className="flex justify-between items-start">
                <span className="text-[10.5px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#FFF2E6] text-[#FF7000]">
                  金海機場
                </span>
                <a
                  href="https://naver.me/xWITUUj9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#5D4037] text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer"
                >
                  地圖
                </a>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-[#3F2B20] text-sm sm:text-base leading-tight">
                  MONEY BOX 金海機場店
                </h4>
                <p className="text-[#8C7E74] text-[11.5px] font-semibold">輕軌站 1 樓</p>
                <p className="text-[#8C7E74] text-[11.5px] font-semibold flex items-center gap-1">
                  ⏱️ 平日 06:00–21:00
                </p>
              </div>
            </div>

            {/* 南浦洞 (最推薦！匯率佳) */}
            <div className="bg-[#FFFDF9] rounded-2xl p-4.5 border border-[#E8E1D5] shadow-xs space-y-3 divide-y divide-[#E8E1D5]/40">
              <div className="pb-3 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10.5px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-md bg-[#FCE4EC] text-[#D81B60]">
                    南浦洞（最推薦！匯率佳）
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#3F2B20] text-sm sm:text-base leading-tight">
                      MONEY BOX 南浦店
                    </h4>
                    <p className="text-[#8C7E74] text-[11.5px] font-semibold flex items-center gap-1">
                      ⏱️ 平日 09:00-19:00 / 週末 10:00-21:00
                    </p>
                  </div>
                  <a
                    href="https://naver.me/xVBxrGfa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#5D4037] text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer flex-shrink-0"
                  >
                    地圖
                  </a>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#3F2B20] text-sm sm:text-base leading-tight">
                    MONEYPLANET BUSAN
                  </h4>
                  <p className="text-[#8C7E74] text-[11.5px] font-semibold flex items-center gap-1">
                    ⏱️ 週一～週六 09:00-20:00 / 週日 09:00-18:00
                  </p>
                </div>
                <a
                  href="https://naver.me/5mvhZSlG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#5D4037] text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer flex-shrink-0"
                >
                  地圖
                </a>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#3F2B20] text-sm sm:text-base leading-tight">
                    友利換錢所 Woori Exchange
                  </h4>
                  <p className="text-[#8C7E74] text-[11.5px] font-semibold flex items-center gap-1">
                    ⏱️ 08:30-19:30
                  </p>
                </div>
                <a
                  href="https://naver.me/5k7fFTvF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#5D4037] text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer flex-shrink-0"
                >
                  地圖
                </a>
              </div>
            </div>

            {/* 海雲台 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-4.5 border border-[#E8E1D5] shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10.5px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#E3F2FD] text-[#0D47A1]">
                  海雲台
                </span>
                <a
                  href="https://naver.me/FuzrqSsK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#5D4037] text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer"
                >
                  地圖
                </a>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-[#3F2B20] text-sm sm:text-base leading-tight">
                  MONEY BOX 海雲台店
                </h4>
                <p className="text-[#8C7E74] text-[11.5px] font-semibold flex items-center gap-1">
                  ⏱️ 營業時間 ： 09:00-19:00
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === "tax" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* Card Wrapper */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5.5 border border-[#E8E1D5] shadow-xs space-y-5.5">
            <h3 className="font-serif font-black text-lg text-[#3F2B20] flex items-center gap-2 select-none">
              <span>🛍️</span>
              <span>免稅與退稅超強攻略</span>
            </h3>

            {/* 機場叮嚀: pink alert box */}
            <div className="p-4 bg-[#FDF2ED] border border-[#F5E6DC] rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-[#A47551] font-bold shadow-3xs">
              <span className="text-base select-none shrink-0" role="img" aria-label="warning">🚨</span>
              <p className="leading-relaxed">
                <span className="font-black text-[#8D5B4C]">機場叮嚀：</span>在金海機場先辦完「退稅」再託運行李！購物滿 15,000 韓元即可跟店員出示護照申請。
              </p>
            </div>

            {/* 1. 現場折抵: 商店現場即時退稅 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 select-none">
                <span className="px-2 py-1 text-[11px] font-black bg-[#768A7A] text-white rounded-md whitespace-nowrap">
                  現場折抵
                </span>
                <span className="font-black text-[15px] sm:text-base text-[#3F2B20]">
                  商店現場即時退稅
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#5C534C] leading-relaxed pl-1 select-text">
                如 <span className="font-black text-black">Olive Young</span>、<span className="font-black text-black">大創</span>。結帳時向店員出示護照並告知 <span className="font-black text-[#A47551]">Tax Free</span>，結帳金額將直接扣除免稅額，此類單據無須在機場辦理任何手續！
              </p>
            </div>

            <hr className="border-[#E8E1D5]/40" />

            {/* 2. 機場退稅: 非現場退稅流程 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <span className="px-2 py-1 text-[11px] font-black bg-[#A7988E] text-white rounded-md whitespace-nowrap">
                  機場退稅
                </span>
                <span className="font-black text-[15px] sm:text-base text-[#3F2B20]">
                  非現場退稅流程
                </span>
              </div>

              {/* Warning label prompt */}
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-xs text-amber-800 font-bold select-none">
                <span className="text-sm shrink-0">⚠️</span>
                <p>確保店員附給您的單據上有護照資料以及條碼/QR code！</p>
              </div>

              {/* Numbered Steps List */}
              <div className="space-y-4 pl-1 select-text">
                {/* Step 1 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#EBE5DA] text-[#3F2B20] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 select-none">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs sm:text-sm text-[#3F2B20]">
                      抵達機場 KIOSK 機台：
                    </h4>
                    <p className="text-xs sm:text-sm text-[#8C7E74] font-semibold leading-relaxed">
                      在金海機場 Gate 4 旁的 <span className="font-black text-[#3F2B20]">[退稅機台]</span> 掃描退稅單據。
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#EBE5DA] text-[#3F2B20] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 select-none">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs sm:text-sm text-[#3F2B20]">
                      海關查驗與蓋章：
                    </h4>
                    <p className="text-xs sm:text-sm text-[#8C7E74] font-semibold leading-relaxed">
                      若機台顯示為 <span className="font-mono font-black text-[#8D5B4C]">X</span> (通常單筆金額 &gt;75,000 韓元)，須至海關櫃檯出示未拆封物品查驗蓋章。
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#EBE5DA] text-[#3F2B20] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 select-none">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs sm:text-sm text-[#3F2B20]">
                      安全檢查後領取：
                    </h4>
                    <p className="text-xs sm:text-sm text-[#8C7E74] font-semibold leading-relaxed">
                      託運行李並通過安檢出境，前往 Gate 4 的 <span className="font-black text-blue-600">[NICE TAX FREE] 藍色櫃台</span> 或機台領取退稅退還的現金。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#E8E1D5]/40" />

            {/* 3. Extra Map Links */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm select-none font-bold">
              {/* Link 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-neutral-50 border border-[#EBE5DA] transition-colors">
                <div className="flex items-center gap-1.5 text-[#3F2B20]">
                  <span role="img" aria-label="pin" className="text-sm">📍</span>
                  <span>Ready Young 藥局退稅機：</span>
                </div>
                <a
                  href="https://map.naver.com/v5/search/%EB%A0%88%EB%94%94%EC%98%81%EC%95%BD%EA%B5%AD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A47551] hover:text-[#8D5B4C] flex items-center gap-0.5"
                >
                  <span>查看地圖</span>
                  <span>➔</span>
                </a>
              </div>

              {/* Link 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-neutral-50 border border-[#EBE5DA] transition-colors">
                <div className="flex items-center gap-1.5 text-[#3F2B20]">
                  <span role="img" aria-label="link" className="text-sm">🔗</span>
                  <span>Dozn Exchange 全韓退稅機位置查詢：</span>
                </div>
                <a
                  href="https://mx-dozn.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A47551] hover:text-[#8D5B4C] flex items-center gap-0.5"
                >
                  <span>官網連結</span>
                  <span>➔</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

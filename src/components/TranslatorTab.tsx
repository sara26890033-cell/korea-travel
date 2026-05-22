/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PhraseItem } from "../types";
import {
  Languages,
  Volume2,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  MessageSquarePlus,
  Compass,
  AlertCircle
} from "lucide-react";

interface TranslatorTabProps {
  phrases: PhraseItem[];
  addPhrase: (chinese: string, korean: string, pronunciation?: string, category?: any) => void;
  deletePhrase: (id: string) => void;
}

export function TranslatorTab({
  phrases,
  addPhrase,
  deletePhrase
}: TranslatorTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Input states for adding new phrase
  const [chineseIn, setChineseIn] = useState<string>("");
  const [koreanIn, setKoreanIn] = useState<string>("");
  const [papagoText, setPapagoText] = useState<string>("");

  // Sound play state
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  // Load voices early
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const triggerSpeak = (text: string, id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("此瀏覽器不支援網頁 TTS 語音朗讀合成。");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";

      // Slow down speech speed slightly so it's easier to follow
      utterance.rate = 0.8;

      // Select Korean voice if available
      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(
        (v) => v.lang.includes("ko") || v.lang.includes("KO")
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      utterance.onstart = () => setIsPlayingId(id);
      utterance.onend = () => setIsPlayingId(null);
      utterance.onerror = () => setIsPlayingId(null);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis error:", e);
      setIsPlayingId(null);
    }
  };

  const categoriesList = ["全部", "常用", "交通", "美食", "購物", "緊急", "我的自訂"];

  // Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chineseIn.trim() || !koreanIn.trim()) return;

    addPhrase(chineseIn.trim(), koreanIn.trim(), undefined, "我的自訂");
    setChineseIn("");
    setKoreanIn("");
  };

  // Filtering
  const filteredPhrases = phrases.filter((phrase) => {
    const matchesCategory = selectedCategory === "全部" || phrase.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      phrase.chinese.toLowerCase().includes(searchLower) ||
      phrase.korean.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* 🗣️ 韓文即時翻譯助手 - 比照圖片設計 */}
      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs relative overflow-hidden">
        <h3 className="font-serif font-black text-base text-[#3F2B20] mb-3.5 flex items-center gap-2">
          🗣️ 韓文即時翻譯助手
        </h3>

        <div className="bg-[#FAF5EB]/50 p-4 rounded-xl border border-[#DCD5C9]/50 space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs text-[#8C7E74] font-bold">
            <span role="img" aria-label="link">🔗</span>
            <span>輸入中文，一鍵至 Papago 網頁翻譯</span>
          </div>

          <input
            type="text"
            placeholder="例：請問這個有現貨嗎？"
            value={papagoText}
            onChange={(e) => setPapagoText(e.target.value)}
            className="w-full text-xs bg-white border border-[#EBE5DA] rounded-xl px-3.5 py-3 text-[#3F2B20] font-medium placeholder-gray-400 focus:outline-none focus:border-[#768A7A] focus:ring-1 focus:ring-[#768A7A]"
          />

          <a
            href={`https://papago.naver.com/?sk=zh-CN&tk=ko&hn=1&st=${encodeURIComponent(papagoText.trim() || "請問這個有現貨嗎？")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#768A7A] hover:bg-[#5C6E60] text-white text-xs font-black text-center rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer select-none"
          >
            <span>💬 開啟 Papago 網頁翻譯</span>
          </a>
        </div>
      </div>

      {/* 2. 常用隨同隨身句庫 */}
      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs">
        <div className="mb-4 pb-2 border-b border-[#FAF5EB]">
          <h3 className="font-serif font-black text-base text-[#3F2B20] flex flex-wrap items-center gap-1 leading-snug">
            <span>日常高頻語句</span>
            <span className="text-xs text-[#8C7E74] font-medium font-sans">
              (點擊喇叭即可播放真人韓語發音 🔊)
            </span>
          </h3>
        </div>

        {/* 搜尋 + 分類過濾 */}
        <div className="space-y-3.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#8C7E74]" />
            <input
              type="text"
              placeholder="搜尋關鍵句子、中文或韓文..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#FAF5EB] border border-[#E8E1D5] rounded-xl pl-9 pr-4 py-2.5 text-[#3F2B20] focus:outline-none focus:border-[#A47551]"
            />
          </div>

          {/* Categories slide bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#A47551] text-[#FAF6EE] border-[#A47551] font-semibold"
                    : "bg-[#FAF5EB] text-[#8C7E74] border-[#E8E1D5] hover:text-[#A47551] hover:border-[#A47551]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of phrases - 刪除拼音, 比照圖片排版 */}
        <div className="mt-5 space-y-3.5">
          {filteredPhrases.length > 0 ? (
            filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8E1D5]/40 hover:border-[#A47551]/30 transition-all flex items-center justify-between gap-4 card-shadow"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FAF5EB]/80 text-[#A47551] rounded-md uppercase border border-[#E8E1D5]/20">
                      {phrase.category}
                    </span>
                    <h4 className="font-extrabold text-[#8C7E74] text-xs sm:text-sm">{phrase.chinese}</h4>
                  </div>

                  <p className="font-serif font-black text-base sm:text-xl text-[#3F2B20] select-all break-words leading-tight tracking-wide">
                    {phrase.korean}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 select-none">
                  <button
                    id={`tts-play-btn-${phrase.id}`}
                    onClick={() => triggerSpeak(phrase.korean, phrase.id)}
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingId === phrase.id
                        ? "bg-[#E5A93C] text-white border-[#E5A93C] animate-soft-pulse"
                        : "bg-[#FFFDF9] hover:bg-[#768A7A]/10 text-gray-400 group border-[#E8E1D5] hover:border-[#768A7A]/30"
                    }`}
                    title="播放真人韓語發音 (TTS)"
                  >
                    <Volume2 className={`w-5 h-5 ${isPlayingId === phrase.id ? "text-white" : "text-[#A47551] opacity-75 group-hover:opacity-100"}`} />
                  </button>

                  {phrase.category === "我的自訂" && (
                    <button
                      onClick={() => deletePhrase(phrase.id)}
                      className="h-11 w-11 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 hover:border-red-500 text-red-400 transition-colors cursor-pointer flex items-center justify-center"
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[#FAF5EB]/30 rounded-xl border border-dashed border-[#E8E1D5]/50 text-xs text-[#8C7E74] select-none">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#8C7E74]/60" />
              <span>找不到符合關鍵字或分類的常用句子哦！</span>
            </div>
          )}
        </div>
      </div>

      {/* ➕ 新增我的常用句備忘 - 始終顯示，比照圖片設計 */}
      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs">
        <h3 className="font-serif font-black text-base text-[#A47551] mb-3.5 flex items-center gap-2">
          <span>➕</span>
          <span>新增我的常用句備忘</span>
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="中文意思 (例：不要太辣)"
            value={chineseIn}
            onChange={(e) => setChineseIn(e.target.value)}
            className="w-full text-xs bg-[#FFFDF9] border border-[#EBE5DA] rounded-xl px-3.5 py-3 text-[#3F2B20] font-medium placeholder-gray-400 focus:outline-none focus:border-[#A47551]"
          />

          <input
            type="text"
            required
            placeholder="韓文文字 (例：덜 맵게 해주세요)"
            value={koreanIn}
            onChange={(e) => setKoreanIn(e.target.value)}
            className="w-full text-xs bg-[#FFFDF9] border border-[#EBE5DA] rounded-xl px-3.5 py-3 text-[#3F2B20] font-medium placeholder-gray-400 focus:outline-none focus:border-[#A47551]"
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#C5B9AC] hover:bg-[#BCAE9F] text-[#42342A] text-xs sm:text-sm font-black text-center rounded-xl transition-colors cursor-pointer select-none shadow-3xs"
          >
            確認新增常用句
          </button>
        </form>
      </div>
    </div>
  );
}

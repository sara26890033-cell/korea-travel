/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { toiletSearchKeywords, initialFlights, initialHotel } from "../data";
import {
  Plane,
  Building,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Search,
  Smartphone,
  Compass,
  ArrowRight,
  Clock
} from "lucide-react";

export function BasicInfoTab() {
  const [subTab, setSubTab] = useState<"flight_hotel" | "toilet" | "pwa_guide" >("flight_hotel");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-4.5 pb-10">
      {/* ✈️ 雙層式子功能切換選單 (主次要功能顏色與排版顯著區隔) */}
      <div className="space-y-2 select-none">
        <div className="flex bg-[#F0EAE1] rounded-2xl p-1.5 border border-[#DCD5C9] shadow-inner gap-1">
          <button
            onClick={() => setSubTab("flight_hotel")}
            className={`flex-1 py-3 text-center text-[12.5px] sm:text-xs md:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === "flight_hotel"
                ? "bg-[#768A7A] text-[#FAF6EE] shadow-md scale-[1.01]"
                : "text-[#8C7E74] hover:text-[#A47551] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]"
            }`}
          >
            <span>✈️ 航班 / 住宿資訊</span>
          </button>
          <button
            onClick={() => setSubTab("toilet")}
            className={`flex-1 py-3 text-center text-[12.5px] sm:text-xs md:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === "toilet"
                ? "bg-[#768A7A] text-[#FAF6EE] shadow-md scale-[1.01]"
                : "text-[#8C7E74] hover:text-[#A47551] bg-[#FFFDF9]/60 hover:bg-[#FFFDF9]"
            }`}
          >
            <span>🚽 尋找附近廁所</span>
          </button>
        </div>

        {/* 📲 次要輔助說明按鈕 - 獨立在[航班]及[廁所]下方，文字與顏色做出區隔 */}
        <div className="flex justify-center">
          <button
            onClick={() => setSubTab("pwa_guide")}
            className={`w-full py-2 text-center text-[11px] font-black rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              subTab === "pwa_guide"
                ? "bg-[#A7988E] border-[#A7988E] text-[#FFFDF9] shadow-xs"
                : "bg-transparent border-[#DCD5C9]/60 text-[#8C7E74] hover:text-[#A47551] hover:bg-[#FFFDF9]/40"
            }`}
          >
            <span>📲 點此查閱：將網頁存至手機主畫面說明 (次要輔助說明)</span>
          </button>
        </div>
      </div>

      {subTab === "flight_hotel" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* 1. 航班資訊 - 頂級時間流對稱排版 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 去程航班 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs space-y-4">
              <div className="flex justify-between items-center select-none border-b border-[#FAF5EB] pb-2.5">
                <span className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded bg-[#E2ECE5] text-[#547963]">
                  去程 OUTBOUND
                </span>
                <span className="text-[11px] font-bold text-[#8C7E74]">2026/06/22 (一)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-1.5">
                  {/* Departure KHH */}
                  <div className="space-y-1">
                    <p className="text-xs text-[#8C7E74] font-semibold">高雄 (KHH)</p>
                    <p className="text-2xl font-black text-[#3F2B20] leading-none font-sans">17:00</p>
                    <p className="text-[10px] bg-[#FAF5EB] text-[#A47551] font-bold px-1.5 py-0.5 rounded inline-block">
                      台灣時間
                    </p>
                  </div>
                  
                  {/* Middle Line */}
                  <div className="flex flex-col items-center flex-1 mx-2 select-none">
                    <span className="text-[10px] text-[#8C7E74] font-bold font-mono">3h 30m</span>
                    <div className="w-full h-px bg-[#E8E1D5] relative my-1">
                      <div className="absolute right-0 -top-1 w-2 h-2 rounded-full border border-[#768A7A] bg-white text-[9px] flex items-center justify-center">🛫</div>
                    </div>
                    <span className="text-[9px] text-[#768A7A] font-bold">濟州航空 7C2686</span>
                  </div>

                  {/* Arrival PUS */}
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-[#8C7E74] font-semibold">釜山 (PUS)</p>
                    <p className="text-2xl font-black text-[#3F2B20] leading-none font-sans">20:30</p>
                    <p className="text-[10px] bg-[#E2ECE5] text-[#547963] font-bold px-1.5 py-0.5 rounded inline-block">
                      韓國時間
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#5C534C] select-none pt-2 border-t border-dashed border-[#E8E1D5]/40">
                  <div className="bg-[#FAF5EB]/50 p-2 rounded-xl text-center">
                    <span className="text-gray-400 text-[10px] block font-bold">出境指南</span>
                    <span className="text-[#3F2B20] font-black">高雄小港機場 3 樓</span>
                  </div>
                  <div className="bg-[#FAF5EB]/50 p-2 rounded-xl text-center">
                    <span className="text-gray-400 text-[10px] block font-bold">行李限額</span>
                    <span className="text-[#3F2B20] font-black">托運 15kg / 手提 10kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 回程航班 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs space-y-4">
              <div className="flex justify-between items-center select-none border-b border-[#FAF5EB] pb-2.5">
                <span className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded bg-[#FCECEE] text-[#9E5D65]">
                  回程 INBOUND
                </span>
                <span className="text-[11px] font-bold text-[#8C7E74]">2026/06/25 (四)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-1.5">
                  {/* Departure PUS */}
                  <div className="space-y-1">
                    <p className="text-xs text-[#8C7E74] font-semibold">釜山 (PUS)</p>
                    <p className="text-2xl font-black text-[#3F2B20] leading-none font-sans">15:00</p>
                    <p className="text-[10px] bg-[#E2ECE5] text-[#547963] font-bold px-1.5 py-0.5 rounded inline-block">
                      韓國時間
                    </p>
                  </div>
                  
                  {/* Middle Line */}
                  <div className="flex flex-col items-center flex-1 mx-2 select-none">
                    <span className="text-[10px] text-[#8C7E74] font-bold font-mono">1h 50m</span>
                    <div className="w-full h-px bg-[#E8E1D5] relative my-1">
                      <div className="absolute right-0 -top-1 w-2 h-2 rounded-full border border-[#9E5D65] bg-white text-[9px] flex items-center justify-center">🛬</div>
                    </div>
                    <span className="text-[9px] text-[#9E5D65] font-bold">德威航空 TW672</span>
                  </div>

                  {/* Arrival KHH */}
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-[#8C7E74] font-semibold">高雄 (KHH)</p>
                    <p className="text-2xl font-black text-[#3F2B20] leading-none font-sans">16:50</p>
                    <p className="text-[10px] bg-[#FAF5EB] text-[#A47551] font-bold px-1.5 py-0.5 rounded inline-block">
                      台灣時間
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#5C534C] select-none pt-2 border-t border-dashed border-[#E8E1D5]/40">
                  <div className="bg-[#FAF5EB]/50 p-2 rounded-xl text-center">
                    <span className="text-gray-400 text-[10px] block font-bold">登機登記</span>
                    <span className="text-[#3F2B20] font-black">金海機場 2 樓</span>
                  </div>
                  <div className="bg-[#FAF5EB]/50 p-2 rounded-xl text-center">
                    <span className="text-gray-400 text-[10px] block font-bold">行李限額</span>
                    <span className="text-[#3F2B20] font-black">托運 15kg / 手提 10kg</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 2. 住宿飯店 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5.5 border border-[#E8E1D5] shadow-xs space-y-4">
            <div className="flex justify-between items-center select-none">
              <span className="text-[11px] font-extrabold tracking-widest px-3 py-1 rounded-md bg-[#EBE5DA] text-[#8C7E74]">
                HOTEL
              </span>
              <a
                href={initialHotel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/40 text-[#4D6352] text-xs font-black rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <span>🗺️ 地圖導航</span>
              </a>
            </div>

            <div>
              <h3 className="font-serif font-black text-xl text-[#3F2B20] tracking-tight">
                {initialHotel.name}
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1 font-mono">
                {initialHotel.krName}
              </p>
            </div>

            {/* Inner Address panel */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#EBE5DA] flex items-center justify-between gap-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="text-sm mt-0.5 shrink-0" role="img" aria-label="pin">📍</span>
                <p className="text-[11.5px] sm:text-xs font-semibold text-[#3F2B20] leading-relaxed select-all break-words">
                  地址：{initialHotel.address}
                </p>
              </div>
              <button
                onClick={() => handleCopyValue(initialHotel.address, "hotel-addr")}
                className="px-2.5 py-1.5 text-xs text-[#8C7E74] hover:text-[#FAF6EE] hover:bg-[#768A7A] border border-[#DCD5C9] hover:border-[#768A7A] rounded-lg transition-all font-black bg-white flex-shrink-0 cursor-pointer shadow-3xs"
              >
                {copiedText === "hotel-addr" ? "已複製" : "複製"}
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === "toilet" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* 3. 尋找最近公廁 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5.5 border border-[#E8E1D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#3F2B20] select-none">
              <span className="text-xl" role="img" aria-label="toilet">🚽</span>
              <h3 className="font-serif font-black text-lg text-[#3F2B20]">
                尋找附近廁所 / 化妝室
              </h3>
            </div>
            
            <p className="text-xs text-[#8C7E74] leading-relaxed font-semibold">
              點擊後會直接跳轉 Naver Map 自動為您搜尋附近的開放式衛生設施。
            </p>

            {/* 2x2 Grid of Toilet Buttons */}
            <div className="grid grid-cols-2 gap-3 pb-2 pt-1 select-none">
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent("지하철")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/30 rounded-2xl transition-all cursor-pointer text-center gap-2 group shadow-3xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#1A1110]/5 group-hover:bg-white flex items-center justify-center transition-colors text-xl">
                  <span>🚇</span>
                </div>
                <span className="font-black text-xs sm:text-sm text-[#3F2B20]">地鐵站</span>
              </a>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent("쇼핑몰")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/30 rounded-2xl transition-all cursor-pointer text-center gap-2 group shadow-3xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#1A1110]/5 group-hover:bg-white flex items-center justify-center transition-colors text-xl">
                  <span>🏢</span>
                </div>
                <span className="font-black text-xs sm:text-sm text-[#3F2B20]">百貨商場</span>
              </a>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent("개방화장실")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/30 rounded-2xl transition-all cursor-pointer text-center gap-2 group shadow-3xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#1A1110]/5 group-hover:bg-white flex items-center justify-center transition-colors text-xl">
                  <span>🔓</span>
                </div>
                <span className="font-black text-xs sm:text-sm text-[#3F2B20]">開放化妝室</span>
              </a>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent("공용화장실")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-5 bg-[#FAF5EB] hover:bg-[#768A7A]/10 border border-[#E8E1D5] hover:border-[#768A7A]/30 rounded-2xl transition-all cursor-pointer text-center gap-2 group shadow-3xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#1A1110]/5 group-hover:bg-white flex items-center justify-center transition-colors text-xl">
                  <span>🚻</span>
                </div>
                <span className="font-black text-xs sm:text-sm text-[#3F2B20]">公用化妝室</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {subTab === "pwa_guide" && (
        <div className="space-y-4.5 animate-fade-in">
          {/* 4. 存至主畫面說明 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs relative overflow-hidden select-text">
            <h3 className="font-serif font-black text-base text-[#3F2B20] mb-3 flex items-center gap-2 text-[#A47551] select-none">
              <Smartphone className="w-5 h-5 text-[#A47551]" />
              將網頁存到手機主畫面 (如同 APP)
            </h3>
            <p className="text-xs text-[#8C7E74] mb-4 leading-relaxed font-semibold">
              無論是 iOS 或是 Android 系統，將此網頁存在手機桌面，就能在釜山隨時點開查看！
            </p>

            {/* Device Guide columns */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-2">
                <h4 className="text-xs font-black text-[#3F2B20] flex items-center gap-1 select-none">
                  🍎 蘋果手機 (iOS Safari)
                </h4>
                <ol className="text-[11px] text-[#8C7E74] space-y-1 ml-3.5 list-decimal font-semibold">
                  <li>打開內建 Safari 瀏覽器加載本網址</li>
                  <li>點擊下方工具列的 <span className="font-semibold text-black bg-white px-1 py-0.5 rounded border border-gray-300">分享</span> 圖示</li>
                  <li>在選單中點選 <span className="font-semibold text-[#A47551]">「加入主畫面 (Add to Home Screen)」</span></li>
                  <li>確認名稱並點選右上角「新增」</li>
                </ol>
              </div>

              <div className="p-3.5 bg-[#FAF5EB] rounded-xl border border-[#EBE5DA] space-y-2">
                <h4 className="text-xs font-black text-[#3F2B20] flex items-center gap-1 select-none">
                  🤖 安卓手機 (Android Chrome)
                </h4>
                <ol className="text-[11px] text-[#8C7E74] space-y-1 ml-3.5 list-decimal font-semibold">
                  <li>使用內建 Google Chrome 瀏覽本網頁</li>
                  <li>點擊右上角三點 <span className="font-semibold text-black bg-white px-1 py-0.5 rounded border border-gray-300">選單</span></li>
                  <li>點擊 <span className="font-semibold text-[#A47551]">「加到主畫面」</span> 或 <span className="font-semibold text-[#A47551]">「安裝應用程式」</span></li>
                  <li>點擊確定，即可將含有專屬釜山圖標的 App 設定於桌面</li>
                </ol>
              </div>
            </div>

            {/* Icon preview simulated badge */}
            <div className="mt-5 p-3.5 bg-yellow-50/50 rounded-xl border border-yellow-100 flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-[#A47551] text-[#FAF6EE] flex flex-col items-center justify-center font-serif text-sm font-bold shadow-xs flex-shrink-0 select-none">
                <span className="leading-none text-[9px] tracking-widest uppercase">BUSAN</span>
                <span className="leading-none text-[14px] mt-0.5">釜山</span>
              </div>
              <div>
                <span className="text-xs font-black text-[#3F2B20]">主畫面專屬應用圖示 (Busan Daily Travel)</span>
                <p className="text-[11px] text-[#8C7E74] mt-0.5 font-semibold">
                  儲存到主畫面後，每次點開皆會自動載入您的所有行程、記帳金額，確保在國外沒網路（或離線狀態）時資訊仍能離線讀取不遺失。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

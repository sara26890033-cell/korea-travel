/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LuggageCategory, LuggageItem } from "../types";
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Flame,
  Zap,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info
} from "lucide-react";

interface LuggageTabProps {
  categories: LuggageCategory[];
  toggleItem: (categoryId: string, itemId: string) => void;
  resetAll: () => void;
  checkAll: () => void;
}

export function LuggageTab({
  categories,
  toggleItem,
  resetAll,
  checkAll
}: LuggageTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Sum items
  const totalItemsCount = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItemsCount = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.checked).length,
    0
  );
  const completionPercentage = totalItemsCount > 0 ? Math.round((checkedItemsCount / totalItemsCount) * 100) : 0;

  // Crucial travel bulletins parsed from notes
  const vitalReminders = [
    {
      id: "v1",
      icon: BookmarkCheck,
      color: "text-[#A47551]",
      title: "72小時前入境登錄",
      desc: "必須於出港前 72 小時填妥南韓電子入境申報碼 (Q-CODE) 以加速通關效力。建議儲存 QR 碼截圖於手機。"
    },
    {
      id: "v2",
      icon: Zap,
      color: "text-[#E5A93C]",
      title: "電壓 & 行動電源規範",
      desc: "韓國為 220v 圓腳圓孔插座。行動電源容量限 100Wh 以下，必須貼妥絕緣膠帶、隨身攜帶，絕對不能放托運行李！"
    },
    {
      id: "v3",
      icon: Flame,
      color: "text-red-500 animate-soft-pulse",
      title: "EVE 止痛藥禁帶警告！",
      desc: "⚠️ 日本 EVE 止痛藥含有「丙烯異丙乙酸尿」防爆成分，韓國法規列為非法禁藥，入境被查獲會面臨重罰，千萬別帶！"
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* 頂部即時公告/備忘小提醒 */}
      <div className="bg-[#FFFDF9] rounded-2xl p-4.5 border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#A47551] animate-soft-bounce" />
          <h3 className="font-serif font-bold text-base text-[#3F2B20]">航空與韓國入境・核心備忘</h3>
        </div>

        <div className="space-y-3">
          {vitalReminders.map((reminder) => {
            const Icon = reminder.icon;
            return (
              <div
                key={reminder.id}
                className="flex items-start gap-3 p-4 bg-[#FAF5EB] rounded-xl border border-[#E8E1D5]/40 text-sm text-[#3F2B20] shadow-[3xs]"
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${reminder.color}`} />
                <div className="space-y-1 flex-1">
                  <div className="font-extrabold text-[15px] text-[#3F2B20]">{reminder.title}</div>
                  <div className="text-[#8C7E74] text-xs sm:text-sm font-semibold leading-relaxed">{reminder.desc}</div>
                  {reminder.id === "v1" && (
                    <div className="pt-2">
                      <a
                        href="https://cov19ent.kdca.go.kr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#A47551] hover:bg-[#8D5B4C] text-[#FAF6EE] text-[12px] font-black rounded-lg transition-colors shadow-3xs cursor-pointer select-none"
                      >
                        <span>🔗 點此立即申報 Q-CODE 帳號 (官網) ➔</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 總體打包进度條 */}
      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8E1D5] shadow-xs">
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <span className="text-[11px] font-semibold text-[#8C7E74] tracking-wider uppercase">Packing Progress</span>
            <h4 className="text-lg font-bold text-[#3F2B20]">行李收納進度</h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[#A47551]">{completionPercentage}%</span>
            <div className="text-xs text-[#8C7E74]">
              已裝袋 {checkedItemsCount} / {totalItemsCount} 件
            </div>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="w-full bg-[#FAF5EB] h-2.5 rounded-full overflow-hidden border border-[#E8E1D5]/40">
          <div
            className="bg-[#A47551] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Action controllers */}
        <div className="flex gap-2.5 mt-4">
          <button
            onClick={checkAll}
            className="flex-1 py-1.5 text-[11px] font-medium bg-[#A47551]/10 text-[#A47551] border border-[#A47551]/20 rounded-lg hover:bg-[#A47551]/20 transition-all text-center"
          >
            一鍵全部打勾
          </button>
          <button
            onClick={resetAll}
            className="flex-1 py-1.5 text-[11px] font-medium bg-[#FAF6EE] text-[#8C7E74] border border-[#E8E1D5] rounded-lg hover:bg-[#FAF5EB] transition-all text-center"
          >
            重置打包狀態
          </button>
        </div>
      </div>

      {/* 行李分組 */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#FFFDF9] rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs"
          >
            {/* Category title block */}
            <div className="bg-[#FAF5EB]/50 px-4 py-4 border-b border-[#E8E1D5]/40 flex justify-between items-center">
              <h4 className="font-serif font-black text-[#3F2B20] text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-[#A47551]" />
                {category.categoryName}
              </h4>
              <span className="text-[12px] font-mono font-bold text-[#8C7E74] bg-[#FFFDF9] px-3 py-1 rounded-full border border-[#E8E1D5]">
                {category.items.filter((i) => i.checked).length} / {category.items.length} Checked
              </span>
            </div>

            {/* Category remarks note */}
            {category.remarks && category.remarks.length > 0 && (
              <div className="bg-yellow-50/45 px-4 py-3 border-b border-[#E8E1D5]/30">
                {category.remarks.map((rem, i) => (
                  <p key={i} className="text-xs sm:text-sm text-[#8D5B4C] flex items-start gap-1 font-semibold leading-relaxed">
                    <span className="mt-0.5">•</span>
                    <span>{rem}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Checklist items layout */}
            <ul className="divide-y divide-[#FAF5EB]">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  id={`luggage-item-${item.id}`}
                  onClick={() => toggleItem(category.id, item.id)}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#FAF5EB]/30 transition-colors cursor-pointer select-none"
                >
                  <button className="flex-shrink-0 text-[#A47551] focus:outline-none">
                    {item.checked ? (
                      <CheckSquare className="w-5.5 h-5.5 text-[#A47551] fill-[#A47551]/10" />
                    ) : (
                      <Square className="w-5.5 h-5.5 text-[#8C7E74]/60" />
                    )}
                  </button>
                  <span
                    className={`text-[15px] sm:text-base ${
                      item.checked
                        ? "line-through text-[#8C7E74] opacity-75 font-medium"
                        : "text-[#3F2B20] font-bold"
                    }`}
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

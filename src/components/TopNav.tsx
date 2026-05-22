/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Compass,
  CheckSquare,
  Info,
  Languages,
  Coins
} from "lucide-react";

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TopNav({ activeTab, setActiveTab }: TopNavProps) {
  const navItems = [
    { id: "itinerary", label: "行程助手", icon: Compass },
    { id: "luggage", label: "行李清單", icon: CheckSquare },
    { id: "basic", label: "基本資訊", icon: Info },
    { id: "translator", label: "韓文翻譯", icon: Languages },
    { id: "financial", label: "財務助手", icon: Coins }
  ];

  return (
    <nav className="bg-[#FFFDF9] border-b border-[#E8E1D5] px-3 py-2 z-30 sticky top-0 shrink-0">
      <div className="grid grid-cols-5 gap-1.5 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 select-none cursor-pointer ${
                isActive
                  ? "text-[#FAF6EE] bg-[#768A7A] font-medium scale-102 shadow-xs"
                  : "text-[#8C7E74] hover:text-[#A47551] hover:bg-[#FAF5EB]"
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 mb-1 transition-transform duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-[11.5px] sm:text-xs tracking-wide leading-none font-black whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

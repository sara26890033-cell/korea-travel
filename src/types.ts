/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ItinerarySpot {
  id: string;
  time: string;
  title: string;
  purpose?: string;
  naverMapUrl?: string;
  address?: string;
  notes?: string[];
}

export interface DailyItinerary {
  day: number;
  date: string;
  title: string;
  spots: ItinerarySpot[];
  transportInfo?: string; // e.g. "搭乘計程車前往廣安里..."
}

export interface LuggageItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface LuggageCategory {
  id: string;
  categoryName: string;
  items: LuggageItem[];
  remarks?: string[];
}

export interface FlightInfo {
  id: string;
  type: "departure" | "return";
  carrier: string;
  route: string;
  time: string;
  supplement?: string;
}

export interface HotelInfo {
  name: string;
  krName: string;
  url: string;
  address: string;
}

export interface ExchangeBooth {
  id: string;
  name: string;
  area: "機場" | "南浦洞" | "海雲台";
  hours: string;
  url: string;
}

export interface PhraseItem {
  id: string;
  chinese: string;
  korean: string;
  pronunciation?: string;
  category: "常用" | "交通" | "美食" | "購物" | "緊急" | "我的自訂";
}

export interface ExpenseRecord {
  id: string;
  spotId: string; // references ItinerarySpot.id, or "general"
  day: number;
  amount: number; // in KRW
  description: string;
  category?: string; // e.g., "餐飲", "購物", "交通", "娛樂", "其他"
}

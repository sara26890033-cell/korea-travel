/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DailyItinerary,
  LuggageCategory,
  FlightInfo,
  HotelInfo,
  ExchangeBooth,
  PhraseItem
} from "./types";

// 初始航班資訊
export const initialFlights: FlightInfo[] = [
  {
    id: "f1",
    type: "departure",
    carrier: "濟州航空",
    route: "高雄 (KHH) → 釜山 (PUS)",
    time: "2026/06/22 17:00 ~ 20:30",
    supplement: "高雄機場 3 樓出境層"
  },
  {
    id: "f2",
    type: "return",
    carrier: "德威航空",
    route: "釜山 (PUS) → 高雄 (KHH)",
    time: "2026/06/25 15:00 ~ 16:50",
    supplement: "金海機場 2 樓 C 區"
  }
];

// 飯店資訊
export const initialHotel: HotelInfo = {
  name: "釜山海雲台中心彩鴻酒店",
  krName: "트레블로지 해운대 (Travelodge Haeundae)",
  url: "https://map.naver.com/v5/search/%ED%8A%B8%EB%A0%88%EB%B8%94%EB%A1%9C%EC%A7%80%20%ED%95%B1%EC%9A%B4%EB%8C%80",
  address: "부산 해운대구 구남로 22"
};

// 找廁所關鍵字與 NAVER Map 連結
export const toiletSearchKeywords = [
  { keyword: "지하철", chinese: "地鐵站", desc: "地鐵站內公共化妝室，最安全方便" },
  { keyword: "쇼ピング몰", chinese: "百貨商場", desc: "大型百貨、新世界 Centum City 等百貨公司廁所" },
  { keyword: "개방화장실", chinese: "開放式公用廁所", desc: "市區內對大眾全面開放的化妝室" },
  { keyword: "공용화장실", chinese: "公用廁所", desc: "公園或觀光景點附屬的公用化妝室" }
];

// 換錢所資訊
export const initialExchangeBooths: ExchangeBooth[] = [
  {
    id: "ex1",
    name: "MONEY BOX 金海機場店",
    area: "機場",
    hours: "平日 6:00 – 21:00 (輕軌站 1 樓)",
    url: "https://naver.me/xWITUUj9"
  },
  {
    id: "ex2",
    name: "MONEY BOX 南浦店",
    area: "南浦洞",
    hours: "平日 09:00–19:00 / 週末 10:00–21:00",
    url: "https://naver.me/xVBxrGfa"
  },
  {
    id: "ex3",
    name: "MONEYPLANET BUSAN",
    area: "南浦洞",
    hours: "週一至週六 09:00–20:00 / 週日 09:00–18:00",
    url: "https://naver.me/5mvhZSlG"
  },
  {
    id: "ex4",
    name: "友利換錢所 Woori Exchange",
    area: "南浦洞",
    hours: "每日 08:30 – 19:30 (老字號推薦)",
    url: "https://naver.me/5k7fFTvF"
  },
  {
    id: "ex5",
    name: "MONEY BOX 海雲台店",
    area: "海雲台",
    hours: "每日 09:00 – 19:00",
    url: "https://naver.me/FuzrqSsK"
  }
];

// 預設常用句子
export const initialPhrases: PhraseItem[] = [
  {
    id: "p1",
    chinese: "請問這個多少錢？",
    korean: "이것은 얼마예요?",
    pronunciation: "i-geo-seun ol-ma-ye-yo?",
    category: "常用"
  },
  {
    id: "p2",
    chinese: "請載我到這個地址，謝謝。",
    korean: "이 주소로 가주세요, 감사합니다.",
    pronunciation: "i ju-so-ro ga-ju-se-yo, gam-sa-ham-ni-da.",
    category: "交通"
  },
  {
    id: "p3",
    chinese: "請問化妝室在哪裡？",
    korean: "화장실이 어디에 있어요?",
    pronunciation: "hwa-jang-si-ri eo-di-e is-seo-yo?",
    category: "常用"
  },
  {
    id: "p4",
    chinese: "請給我一張收據（退稅用）。",
    korean: "영수증 주세요 (택스프리용).",
    pronunciation: "yeong-su-jeung ju-se-yo (taek-seu-peu-ri-yong).",
    category: "購物"
  },
  {
    id: "p5",
    chinese: "請幫我做不辣的，謝謝。",
    korean: "안 맵게 해주세요, 감사합니다.",
    pronunciation: "an maep-ge hae-ju-se-yo, gam-sa-ham-ni-da.",
    category: "美食"
  },
  {
    id: "p6",
    chinese: "這個可以退稅嗎？",
    korean: "이거 텍스프리 돼요?",
    pronunciation: "i-geo taek-seu-peu-ri dwae-yo?",
    category: "購物"
  },
  {
    id: "p7",
    chinese: "請推薦一下這餐館的招牌菜。",
    korean: "여기 대표 메뉴 추천해 주세요.",
    pronunciation: "yeo-gi dae-pyo me-nyu chu-cheon-hae ju-se-yo.",
    category: "美食"
  },
  {
    id: "p8",
    chinese: "可以幫忙拍照嗎？",
    korean: "사진 좀 찍어주실 수 있으세요?",
    pronunciation: "sa-jin jom jjig-eo-ju-sil su is-seu-se-yo?",
    category: "常用"
  },
  {
    id: "p9",
    chinese: "我迷路了，請問地鐵站在哪？",
    korean: "길을 잃었어요, 지하철역이 어디예요?",
    pronunciation: "gi-reul i-reos-seo-yo, ji-ha-cheol-yeo-gi eo-di-ye-yo?",
    category: "交通"
  },
  {
    id: "p10",
    chinese: "請救救我！我有緊急狀況。",
    korean: "도와주세요! 긴급 상황입니다.",
    pronunciation: "do-wa-ju-se-yo! gin-geup sang-hwang-im-ni-da.",
    category: "緊急"
  }
];

// 初始行李清單
export const initialLuggageCategories: LuggageCategory[] = [
  {
    id: "lc1",
    categoryName: "重要文件",
    remarks: [],
    items: [
      { id: "li1_1", name: "護照正本 (效期半年以上)", checked: false },
      { id: "li1_2", name: "Q-CODE QR Code 截圖", checked: false },
      { id: "li1_3", name: "來回機票與飯店確認單", checked: false },
      { id: "li1_4", name: "韓元現金、預備信用卡", checked: false }
    ]
  },
  {
    id: "lc2",
    categoryName: "電子產品",
    remarks: [],
    items: [
      { id: "li2_1", name: "雙腳圓孔轉接頭、變壓器", checked: false },
      { id: "li2_2", name: "行動電源", checked: false },
      { id: "li2_3", name: "延長線 / 各式充電器及充電線", checked: false },
      { id: "li2_4", name: "網卡 / SIM卡 / 隨身Wi-Fi", checked: false }
    ]
  },
  {
    id: "lc3",
    categoryName: "個人藥品",
    remarks: [],
    items: [
      { id: "li3_1", name: "腸胃藥 / 止瀉藥", checked: false },
      { id: "li3_2", name: "感冒藥 / 退燒藥", checked: false },
      { id: "li3_3", name: "個人慢性病常用藥", checked: false },
      { id: "li3_4", name: "OK繃與外傷藥膏", checked: false }
    ]
  },
  {
    id: "lc4",
    categoryName: "個人衣物",
    remarks: [],
    items: [
      { id: "li4_1", name: "個人換洗衣物、內著衣襪", checked: false },
      { id: "li4_2", name: "防風外套 / 遮陽外套 (海邊風大)", checked: false },
      { id: "li4_3", name: "好走透氣便鞋、慢跑鞋", checked: false },
      { id: "li4_4", name: "遮陽帽、太陽眼鏡", checked: false }
    ]
  },
  {
    id: "lc5",
    categoryName: "盥洗與生理用品",
    remarks: [],
    items: [
      { id: "li5_1", name: "牙刷與牙膏 (部分環保旅宿不提供)", checked: false },
      { id: "li5_2", name: "防曬乳 / 防曬噴霧", checked: false },
      { id: "li5_3", name: "保濕乳液、護唇膏 (韓國較乾燥)", checked: false },
      { id: "li5_4", name: "隱形眼鏡、保養液與眼鏡", checked: false }
    ]
  },
  {
    id: "lc6",
    categoryName: "其他隨身好物",
    remarks: [],
    items: [
      { id: "li6_1", name: "折疊晴雨傘", checked: false },
      { id: "li6_2", name: "真空衣物收納袋", checked: false },
      { id: "li6_3", name: "退稅單據收納夾", checked: false },
      { id: "li6_4", name: "原子筆 (機上填寫申報單)", checked: false }
    ]
  }
];

// 4天3夜完整詳細行程
export const initialItinerary: DailyItinerary[] = [
  {
    day: 1,
    date: "6/22（日）",
    title: "抵達釜山・初見碧海",
    transportInfo: "17:00高雄起飛 ➔ 20:30抵達 ➔ 21:00起搭車 ➔ 21:30 入住酒店",
    spots: [
      {
        id: "d1-s1",
        time: "20:30",
        title: "抵達釜山金海國際機場",
        purpose: "機場辦理入境、提取行李與辦理SIM卡",
        naverMapUrl: "https://naver.me/GNRjwFwb",
        address: "부산 강서구 공항진입로 108",
        notes: [
          "辦理入關手續，跟著指標走",
          "提領大件行李，記得順便在MONEY BOX輕軌站機台換點零錢，或者直接用WOWPASS卡"
        ]
      },
      {
        id: "d1-s2",
        time: "約 21:00",
        title: "搭乘計程車前往海雲台飯店",
        purpose: "搭計程車直接抵達飯店快速又省力",
        notes: [
          "車程大約 30 分鐘，費用在 25,000 ~ 30,000 韓元之間",
          "如果司機不懂中文可以把飯店的 NAVER MAP 或韓文地址直接亮給司機看"
        ]
      },
      {
        id: "d1-s3",
        time: "約 21:30",
        title: "辦理入住｜釜山海雲台中心彩鴻酒店",
        purpose: "飯店 Check-in 放置重物",
        naverMapUrl: "https://map.naver.com/v5/search/%ED%8A%B8%EB%A0%88%EB%B8%94%EB%A1%9C%EC%A7%80%20%ED%95%B1%EC%9A%B4%EB%8C%80",
        address: "부산 해운대구 구남로 22",
        notes: [
          "韓文：트레블로지 해운대 (Travelodge Haeundae)",
          "位於古南路/海雲台地鐵站附近，出入、用餐與逛街極其便利，且步行即可抵達海水浴場！"
        ]
      },
      {
        id: "d1-s4",
        time: "深夜",
        title: "第一晚的美味宵夜：韓式炸雞",
        purpose: "體驗正宗韓國宵夜文化",
        notes: [
          "推薦品牌一：🍖 PURADAK 炸雞 (푸라닭치킨) - 高級的黑色包裝，強烈的烘烤過再油炸工法，外酥內嫩！",
          "推薦品牌二：🍗 60雞炸雞 (60계치킨) - 主打「每桶新油只炸 60 隻雞」，健康純淨無油耗味！",
          "可使用外送平台、請飯店櫃檯代點，或在飯店周邊散步外帶，配上清涼啤酒享受釜山第一晚！"
        ]
      }
    ]
  },
  {
    day: 2,
    date: "6/23（一）",
    title: "廣安里海景・南浦洞狂歡購物日",
    transportInfo: "飯店 ➔ (計程車10分) ➔ 廣安里 ➔ (計程車30分) ➔ 南浦洞 ➔ (計程車) ➔ 松島纜車",
    spots: [
      {
        id: "d2-s1",
        time: "09:30～11:00",
        title: "廣安里海景早午餐｜Working Holiday",
        purpose: "享受絕美廣安大橋海景 + 豐盛早午餐",
        naverMapUrl: "https://naver.me/xgNS92At",
        address: "부산 수영구 광안해변로 235 3층 워킹홀리데이",
        notes: [
          "韓文店名：워킹홀리데이 (Working Holiday)",
          "位於 Olive Young 廣安里店的 3 樓，觀看廣安大橋視野絕佳",
          "熱門窗邊位置需稍作等待，咖啡與舒芙蕾推薦！"
        ]
      },
      {
        id: "d2-s2",
        time: "11:30～15:00",
        title: "光復路時尚街 (南浦洞巨星購物特區)",
        purpose: "釜山南浦洞核心商業街巡禮",
        naverMapUrl: "https://naver.me/xNLXIkNq",
        address: "남포역(해동병원)7번출구 (地鐵南浦站7號出口)",
        notes: [
          "【必逛服飾】SPA 品牌 WHO.A.U、SPAO、8 Seconds、Wonder Place、The North Face 白標店，這裡樣式超齊全",
          "【雜貨伴手】ARTBOX 文具雜貨 (超療癒小物插畫公仔)；大創 3層樓旗艦店 (韓國限定大創好物推薦，地圖：https://naver.me/x0UABelr)",
          "【人氣美食】HBAF 杏仁果專賣店有豐富口味試吃 (地圖：https://naver.me/GRoZoJ5K)；BIFF 廣場排隊吃必吃「元祖黑糖餅」(地圖：https://naver.me/FDnCfOLW)",
          "【藥妝必買】大間 Olive Young 旗艦門市 (韓系保養一應俱全，地圖：https://naver.me/x8tpgm68)；以及 Ready Young 等免稅藥局 (地圖：https://naver.me/F42MYkSY)"
        ]
      },
      {
        id: "d2-s3",
        time: "15:00～16:30",
        title: "喉嚨烤肉 ( 목구멍 Nampo )",
        purpose: "大啖韓式極厚厚切釜蓋五花肉",
        naverMapUrl: "https://naver.me/GI3heSHE",
        address: "부산 중구 남포길 38-1 (南浦洞美食必列)",
        notes: [
          "使用巨大的鑄鐵釜蓋炙烤，五花肉外焦裡嫩鎖住滿嘴肉汁",
          "全程有專業店員幫忙烤肉剪肉，搭配獨門辣醬及生菜泡菜！"
        ]
      },
      {
        id: "d2-s4",
        time: "16:30～17:30",
        title: "富平罐頭市場",
        purpose: "釜山老牌傳統夜市/小吃聚集地",
        naverMapUrl: "https://naver.me/GCvq48kt",
        address: "부산 중구 부평1길 48",
        notes: [
          "推薦品嚐：釜山魚糕、魚卵炒飯、油豆腐包、香辣拌寬粉",
          "一邊拿著小吃，一邊感受在地阿珠媽的熱情魅力"
        ]
      },
      {
        id: "d2-s5",
        time: "16:30～17:30",
        title: "國際市場",
        purpose: "歷史洋溢的老字號批發街，必買韓式棉被",
        naverMapUrl: "https://naver.me/GuDx2J0F",
        address: "부산 중구 신창동4가",
        notes: [
          "備註：此處地圖導航設定為熱門的「台灣老闆娘開的棉被店家」，溝通熱情零障礙，非常推薦！",
          "最著名的是「韓式棉被」，質地極佳、輕柔保暖又可機洗，老闆會幫忙抽真空打包方便帶上飛機",
          "各種生活日雜、古著、韓風餐具應有盡有"
        ]
      },
      {
        id: "d2-s6",
        time: "17:45～18:45",
        title: "松島海上觀光纜車 (송도해상케이블카)",
        purpose: "搭乘凌空水晶纜車，飽覽影島落日與大海",
        naverMapUrl: "https://naver.me/Fmf6KBhZ",
        address: "부산 서구 송도해변로 171",
        notes: [
          "可以預定「水晶車廂」(地板全透明)，拍照刺激感十足",
          "這個時間點來能完美捕獲夕陽西下時，廣闊大海被染成橘紅色的唯美瞬間"
        ]
      },
      {
        id: "d2-s7",
        time: "晚上",
        title: "返回飯店 | 休息整理今日瘋狂戰利品",
        purpose: "放鬆疲憊雙腿",
        naverMapUrl: "https://naver.me/xucpY7PI",
        address: "釜山海雲台中心彩鴻酒店"
      }
    ]
  },
  {
    day: 3,
    date: "6/24（二）",
    title: "海雲台漫步・青沙浦天空膠囊之旅",
    transportInfo: "早餐 ➔ Homeplus ➔ 返回飯店放戰利品 ➔ (計程車15分) ➔ 海理團路 ➔ 青沙浦 ➔ 天空膠囊 ➔ 市場",
    spots: [
      {
        id: "d3-s1",
        time: "09:30～10:30",
        title: "水邊最高豬肉湯飯 (수변최고돼지국밥)",
        purpose: "釜山人靈魂早點！熱呼呼地道豬肉湯飯",
        naverMapUrl: "https://naver.me/FTXwcV8c",
        address: "부산 해운대구 센텀3로 26 (Centum分店，靠近飯店)",
        notes: [
          "湯頭熬煮至乳白色，豬牛肉分量極有誠意，加上滿滿蝦醬與韭菜攪拌入味",
          "熱門店家，建議稍微提前抵達避開最擁擠的排隊人龍"
        ]
      },
      {
        id: "d3-s2",
        time: "10:30～12:30",
        title: "Homeplus 巨大型超市",
        purpose: "大肆採購便利餐食、泡麵、零食伴手禮",
        naverMapUrl: "https://naver.me/Fuz5sQvj",
        address: "부산 해운대구 우동 1407 (Centum City店)",
        notes: [
          "韓國超好逛的本土大超市！各種口味堅果、零食、辣醬、泡菜一次買齊",
          "現場提供打包紙箱，還可以憑護照當場扣除稅額辦退稅！"
        ]
      },
      {
        id: "d3-s3",
        time: "13:00～15:00",
        title: "海理團路 (Café Walk)",
        purpose: "散步、尋覓質感網美文青咖啡館與選品店",
        naverMapUrl: "https://naver.me/xmxIx8kL",
        address: "부산 해운대구 우동1로20번길 21 1층 (導航推薦至人氣伴手禮選品店)",
        notes: [
          "由廢棄舊鐵路宿舍群翻新而成的超人氣文青市區",
          "有名伴手禮備註：推薦購買【BUSAN BADA SAND】（釜山沙灘夾心餅），它是鳳梨酥與牛奶糖的完美結合，口感豐富精緻，包裝極有紀念價值！",
          "有可愛插畫文具店、韓系黑白照相拍貼館，以及非常多的手工甜點店"
        ]
      },
      {
        id: "d3-s4",
        time: "15:00～16:30",
        title: "味贊王鹽烤肉 (맛찬들왕소금구이)",
        purpose: "品嚐3.5公分黃金厚度巨無霸鹽烤豬五花",
        naverMapUrl: "https://naver.me/GSDACPH7",
        address: "부산 해운대구 우동 543-2",
        notes: [
          "熟成豬五花爆出滿嘴噴香的脂香，表面烤得酥脆香濃",
          "特製辣拌蔥、泡菜以及醃製紫蘇葉包肉一起吃，解膩一絕！"
        ]
      },
      {
        id: "d3-s5",
        time: "17:00～17:45",
        title: "青沙浦站 (灌籃高手海岸平交道)",
        purpose: "打卡海景鐵道經典畫面、散步聽濤",
        naverMapUrl: "https://naver.me/xq3aEIjM",
        address: "부산 해운대구 청사포로 116 (青沙浦海岸線區)",
        notes: [
          "因為極為神似《灌籃高手》鐮倉場景而爆紅的湛藍海岸道路",
          "建議前往海邊著名的雙子紅綠燈塔攝影，夕陽前光線暖和極好拍"
        ]
      },
      {
        id: "d3-s6",
        time: "18:00～18:30",
        title: "海雲台天空膠囊列車 (青沙浦 ➔ 尾浦)",
        purpose: "浪漫行駛於岩壁軌道上的彩色膠囊高空小列車",
        notes: []
      },
      {
        id: "d3-s7",
        time: "18:30",
        title: "自然島鹽麵包 (자연도소금빵 海雲台尾浦店)",
        purpose: "暴風排隊名店，出爐香氣逼死人",
        naverMapUrl: "https://naver.me/xrSQSF2f",
        address: "부산 해운대구 달맞이길62번길 38 1층",
        notes: [
          "每天限制時段出爐，剛出爐的外皮油亮酥香，底邊微焦帶點焦糖脆，裡面則是軟綿充滿著高級鹽奶油的香甜！",
          "一口咬下去極為罪惡但保證超乎預期"
        ]
      },
      {
        id: "d3-s8",
        time: "19:00～深夜",
        title: "海雲台海水浴場沙灘 (散步夜景)",
        purpose: "漫步在鬆軟沙灘上，仰望LCT摩天大樓群夜景",
        naverMapUrl: "https://naver.me/F0z2RxAs",
        address: "부산 해운대구 우동 (海雲台海水浴場)",
        notes: [
          "從鹽麵包走過來的路程文字已正名為「沿著海灘散步(約13分鐘)」，吹著晚風聽著海浪散步超級愜意！",
          "海雲台沙灘夜晚有著獨特的迷人波光，常有街頭藝人在此自彈自唱，氣氛超級慵懶浪漫"
        ]
      },
      {
        id: "d3-s9",
        time: "19:00～深夜",
        title: "海雲台傳統市場",
        purpose: "回程晚餐/宵夜：辣炒年糕、盲鰻、糖餅與辣魚湯",
        naverMapUrl: "https://naver.me/GzE9ensG",
        address: "부산 해운대구 중동1로 42-16",
        notes: [
          "尚國家辣炒年糕(상국이네)是極熱門的名店，年糕粗彈、醬汁濃厚！",
          "一邊吃著烤盲鰻，一邊在釜山涼涼晚風中慢慢享用"
        ]
      },
      {
        id: "d3-s10",
        time: "晚上",
        title: "返回飯店休息",
        purpose: "帶點市場小吃和飲料，回飯店好好放鬆",
        naverMapUrl: "https://naver.me/xucpY7PI",
        address: "釜山海雲台中心彩鴻酒店"
      }
    ]
  },
  {
    day: 4,
    date: "6/25（三）",
    title: "漫步釜山・帶滿回憶歸國",
    transportInfo: "整理退房 ➔ 12:30 搭乘計程車前往機場 ➔ 13:00 抵達 ➔ 15:00 搭機返台",
    spots: [
      {
        id: "d4-s1",
        time: "上午",
        title: "行李最後大整理、退房辦理",
        purpose: "確認美妝、衣服打包無漏，完成退房手續",
        notes: [
          "退房時如果是易碎品或免稅棉被包，可以請酒店前台稍微綁緊打包",
          "確認退稅單據都在夾鏈袋內收納好！"
        ]
      },
      {
        id: "d4-s2",
        time: "12:30",
        title: "搭乘計程車前往金海國際機場",
        purpose: "計程車直接返程最輕鬆，避免提著大包小包行李擠輕軌",
        notes: [
          "預計車程約30 ~ 40分鐘，遇到市區早高峰塞車可能在50分鐘，費用約 28,000 韓元"
        ]
      },
      {
        id: "d4-s3",
        time: "13:00",
        title: "抵達金海機場 ➔ 辦理免稅與託運",
        purpose: "預留2小時，完成最關鍵的機場退稅流程",
        naverMapUrl: "https://naver.me/GNRjwFwb",
        address: "부산 강서구 공항진입로 108",
        notes: [
          "【重要！！】退稅必須在行李託運之前完成機台掃描！",
          "在金海機場 2 樓 Gate 4 主櫃台有退稅自助掃描機台，將護照與所有退稅單 QR 碼都刷過",
          "如果被列為蓋章審核(單筆金額太大)，必須找旁邊海關蓋章。全部掃完過完安檢後，去 NICE TAX FREE 窗口領回現金！"
        ]
      },
      {
        id: "d4-s4",
        time: "15:00",
        title: "德威航空：飛往高雄",
        purpose: "搭機返程，欣賞窗外美麗藍天",
        notes: [
          "德威航班在金海機場 2 樓 C 區櫃台辦理登機與託運"
        ]
      },
      {
        id: "d4-s5",
        time: "16:50",
        title: "抵達高雄國際機場",
        purpose: "平安到家，期待下次釜山相遇"
      }
    ]
  }
];

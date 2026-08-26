import type { Locale } from '@/lib/translations'

export type ExperienceCategory =
  | 'research'
  | 'racing'
  | 'competition'
  | 'course'
  | 'honor'
  | 'activity'
  | 'software'
  | 'writing'

export type ExperienceType =
  | 'Featured Experience'
  | 'Research'
  | 'Engineering Project'
  | 'Competition'
  | 'Honor'
  | 'Leadership'
  | 'Course Record'
  | 'Writing'

export interface LocalizedText {
  zh: string
  en: string
}

export interface ExperienceImage {
  src: string
  alt: LocalizedText
  caption: LocalizedText
  kind?: 'photo' | 'screenshot' | 'certificate' | 'diagram'
  position?: string
}

export interface ExperienceLink {
  label: LocalizedText
  href: string
}

export interface ExperienceEntry {
  slug: string
  category: ExperienceCategory
  type: ExperienceType
  period: string
  year: string
  featured?: boolean
  title: LocalizedText
  role: LocalizedText
  summary: LocalizedText
  story: LocalizedText[]
  highlights: LocalizedText[]
  skills: string[]
  images: ExperienceImage[]
  evidence: ExperienceImage[]
  links?: ExperienceLink[]
  articleSlug?: string
  privacyNote?: LocalizedText
}

export const categoryLabels: Record<ExperienceCategory, LocalizedText> = {
  research: { zh: '研究', en: 'Research' },
  racing: { zh: '車隊電控', en: 'Racing Team' },
  competition: { zh: '競賽', en: 'Competition' },
  course: { zh: '課程專題', en: 'Course Project' },
  honor: { zh: '獎項', en: 'Honor' },
  activity: { zh: '活動與領導', en: 'Activity' },
  software: { zh: '軟體作品', en: 'Software' },
  writing: { zh: '報告與寫作', en: 'Writing' },
}

export const categoryOrder: ExperienceCategory[] = [
  'research',
  'racing',
  'competition',
  'course',
  'honor',
  'activity',
  'software',
  'writing',
]

export function localized(text: LocalizedText, locale: Locale) {
  return text[locale]
}

export const experienceEntries: ExperienceEntry[] = [
  {
    slug: 'haptic-surgical-simulation',
    category: 'research',
    type: 'Research',
    period: 'Jun 2025 - Present',
    year: '2025-2026',
    featured: true,
    title: {
      zh: '手術力回饋模擬與人機互動研究',
      en: 'Haptic-Feedback Surgical Simulation Research',
    },
    role: {
      zh: '臺大 ICROSS Lab 大學部研究生',
      en: 'Undergraduate Researcher, ICROSS Lab at NTU',
    },
    summary: {
      zh: '以 OpenGL、觸覺裝置與 3D 模型建立手術模擬環境，處理碰撞判定、接觸力計算、低延遲同步與操作穩定性。',
      en: 'Built a surgical simulation environment with OpenGL, haptic devices, and 3D models, focusing on collision handling, force calculation, low-latency synchronization, and stable interaction.',
    },
    story: [
      {
        zh: '這段研究把機械、控制與軟體放在同一個問題裡：使用者不是只看見虛擬器械，而是要透過手感理解接觸、阻力與操作限制。',
        en: 'This research joins mechanical design, control, and software into one problem: the user should not only see the virtual tool, but also feel contact, resistance, and operating constraints.',
      },
      {
        zh: '在開發過程中，我學到力回饋系統不能只判斷功能是否完成，還必須同時考慮回饋力連續性、更新頻率、穿透問題與操作自然度。',
        en: 'The work taught me that a haptic system cannot be judged only by feature completion. Force continuity, update rate, penetration behavior, and natural operation all matter.',
      },
    ],
    highlights: [
      {
        zh: '使用 OpenGL 建立手術模擬場景，整合器械、血管與任務提示。',
        en: 'Built an OpenGL surgical scene integrating tools, vessel geometry, and task guidance.',
      },
      {
        zh: '根據器械與組織模型接觸位置計算回饋力，處理碰撞與操作限制。',
        en: 'Calculated feedback forces from tool-tissue contact and handled collision constraints.',
      },
      {
        zh: '將圖形更新與觸覺回饋同步，降低操作延遲與不穩定震盪。',
        en: 'Synchronized graphics and haptic feedback to reduce latency and unstable vibration.',
      },
    ],
    skills: ['C++', 'OpenGL', 'OpenHaptics', 'Haptic Devices', 'Collision Detection'],
    images: [
      {
        src: '/images/experience/haptic-6dof-design.png',
        kind: 'diagram',
        alt: {
          zh: '六自由度力回饋裝置機構設計圖',
          en: 'Six-degree-of-freedom haptic mechanism design',
        },
        caption: {
          zh: '並聯式力回饋裝置的機構設計，用於縮小手術操作工作空間。',
          en: 'Parallel haptic mechanism design for a compact surgical workspace.',
        },
      },
      {
        src: '/images/experience/haptic-surgery-simulation.jpg',
        kind: 'screenshot',
        alt: {
          zh: '手術力回饋模擬軟體畫面',
          en: 'Surgical haptic simulation software screen',
        },
        caption: {
          zh: '手術模擬軟體中的器械、碰撞狀態與任務提示畫面。',
          en: 'Simulation view showing instruments, collision state, and task instructions.',
        },
      },
    ],
    evidence: [],
    articleSlug: 'haptic-surgical-simulation',
  },
  {
    slug: 'ntu-racing-electrical-systems',
    category: 'racing',
    type: 'Featured Experience',
    period: 'Sep 2023 - Present',
    year: '2023-2026',
    featured: true,
    title: {
      zh: 'NTU Racing 電控與車輛遙測系統',
      en: 'NTU Racing Electrical Systems and Vehicle Telemetry',
    },
    role: {
      zh: '第八屆電系組組長',
      en: '8th Gen Electrical Division Lead',
    },
    summary: {
      zh: '參與學生方程式賽車低壓電控、VCU、CAN/ROS2 資料流、RTK GPS、Raspberry Pi 遙測與跨組測試流程。',
      en: 'Worked on Formula Student low-voltage systems, VCU development, CAN/ROS2 data flow, RTK GPS, Raspberry Pi telemetry, and cross-division testing workflows.',
    },
    story: [
      {
        zh: '車隊讓我把機械背景轉成更完整的系統觀：每一個軟體假設最後都會碰到感測器、線路、電源、延遲、測試流程與車輛行為。',
        en: 'The team turned my mechanical background into a stronger systems view: every software assumption eventually touches sensors, wiring, power, latency, testing, and vehicle behavior.',
      },
      {
        zh: '我負責的不只是寫工具，而是讓車隊在測試時能看見車輛狀態、判斷異常、保留資料，並把電控知識傳給下一屆成員。',
        en: 'My work was not only writing tools. It was about helping the team see vehicle state, diagnose problems, preserve data, and transfer electrical knowledge to the next generation.',
      },
    ],
    highlights: [
      {
        zh: '開發 VCU 相關控制邏輯與 PCB HAT，整合低壓電源、感測與周邊電路。',
        en: 'Developed VCU-related control logic and PCB HAT integration for low-voltage power, sensing, and peripherals.',
      },
      {
        zh: '建立即時遙測流程，串接 CAN、ROS2、Raspberry Pi 與遠端監控介面。',
        en: 'Built telemetry workflows connecting CAN, ROS2, Raspberry Pi, and remote monitoring interfaces.',
      },
      {
        zh: '導入 RTK GPS 與基站校正資料，用於定位、軌跡記錄與車輛動態分析。',
        en: 'Integrated RTK GPS and correction data for positioning, trajectory logging, and vehicle dynamics analysis.',
      },
    ],
    skills: ['Zephyr RTOS', 'STM32', 'CAN Bus', 'ROS2', 'Raspberry Pi', 'RTK GPS', 'KiCad'],
    images: [
      {
        src: '/images/experience/ntu-racing-driver-car.jpg',
        kind: 'photo',
        alt: {
          zh: '坐在 NTU Racing 賽車中的測試現場',
          en: 'Driver seating in the NTU Racing race car',
        },
        caption: {
          zh: 'NTU Racing 賽車測試現場，呈現整車、駕駛艙與電控系統整合的實作場景。',
          en: 'NTU Racing testing scene showing the full vehicle, cockpit, and electrical-system integration.',
        },
        position: '50% 62%',
      },
      {
        src: '/images/experience/ntu-racing-dashboard.jpg',
        kind: 'photo',
        alt: {
          zh: '車隊儀表板硬體',
          en: 'Racing dashboard hardware',
        },
        caption: {
          zh: '用於車輛狀態顯示與測試的硬體 dashboard。',
          en: 'Hardware dashboard for vehicle status display and testing.',
        },
      },
      {
        src: '/images/experience/ntu-racing-sunset-car.jpg',
        kind: 'photo',
        alt: {
          zh: '夕陽下的 NTU Racing 賽車',
          en: 'NTU Racing race car at sunset',
        },
        caption: {
          zh: '測試結束前後的賽車紀錄，保留車隊現場、環境與整車姿態。',
          en: 'Trackside vehicle record around testing, keeping the team environment and full-car stance visible.',
        },
        position: '64% 82%',
      },
      {
        src: '/images/experience/ntu-racing-team-car.jpg',
        kind: 'photo',
        alt: {
          zh: 'NTU Racing 賽車與團隊',
          en: 'NTU Racing car and team',
        },
        caption: {
          zh: '學生方程式賽車整車開發與跨組整合現場。',
          en: 'Formula Student vehicle development and team integration.',
        },
      },
    ],
    evidence: [
      {
        src: '/images/experience/raspberry-pi-talk.jpg',
        kind: 'photo',
        alt: {
          zh: '樹莓派社群講座照片',
          en: 'Raspberry Pi community talk photo',
        },
        caption: {
          zh: '受邀分享車隊電控系統與 Raspberry Pi 應用。',
          en: 'Invited talk on racing electronics and Raspberry Pi applications.',
        },
      },
    ],
    links: [
      {
        label: { zh: 'CANdecoder', en: 'CANdecoder' },
        href: 'https://github.com/Ktliu-Tyler/CANdecoder',
      },
      {
        label: { zh: '遠端監控工具', en: 'Remote monitor' },
        href: 'https://github.com/Ktliu-Tyler/nturacing_remote_monitor',
      },
    ],
    articleSlug: 'ntu-racing-electrical-systems',
  },
  {
    slug: 'jarvis-makentu-smart-life',
    category: 'competition',
    type: 'Competition',
    period: 'May 2026',
    year: '2026',
    featured: true,
    title: {
      zh: 'MakeNTU / Jarvis 桌上型 AI 家庭中樞',
      en: 'MakeNTU / Jarvis Desktop AI Home Hub',
    },
    role: {
      zh: 'AI 對話架構、Agent 功能與人機互動整合',
      en: 'AI dialogue, agent functions, and HMI integration',
    },
    summary: {
      zh: '以本地端模型、Jetson Orin Nano、NXP FRDM-MCXN947、ESP32 與 GUI/語音/視覺控制做出桌上型智慧生活應用，獲 NXP x AVNET 企業命題第一名。',
      en: 'Built a desktop smart-life system with local models, Jetson Orin Nano, NXP FRDM-MCXN947, ESP32, GUI, voice, and vision control, winning first prize in the NXP x AVNET challenge.',
    },
    story: [
      {
        zh: '這個作品把感知、決策與致動整合在一個可互動的桌上型機器人裡。它不是單一演算法展示，而是完整資料流與指令流的系統整合。',
        en: 'This project integrated perception, decision-making, and actuation into an interactive desktop robot. It was less a single algorithm demo and more a full data and command-flow system.',
      },
      {
        zh: '我主要處理 AI 對話與 Agent 功能，讓使用者需求能被轉成頭部馬達、表情、天氣資訊、音樂播放與家電控制等動作。',
        en: 'I focused on AI dialogue and agent functions, translating user intent into head motion, facial expression, weather lookup, music playback, and appliance control.',
      },
    ],
    highlights: [
      {
        zh: '使用本地端模型實作語音對話、意圖理解與隱私保護。',
        en: 'Used local models for voice dialogue, intent understanding, and privacy-preserving interaction.',
      },
      {
        zh: '整合 Jetson、MCU、ESP32、BLE、UART、GUI 與伺服馬達控制。',
        en: 'Integrated Jetson, MCU, ESP32, BLE, UART, GUI, and servo control.',
      },
      {
        zh: '獲 MakeNTU 2026 NXP x AVNET 智慧生活應用企業命題第一名。',
        en: 'Won first prize in the MakeNTU 2026 NXP x AVNET smart-life challenge.',
      },
    ],
    skills: ['NXP FRDM-MCXN947', 'Jetson Orin Nano', 'FreeRTOS', 'LVGL', 'ESP32', 'Local LLM'],
    images: [
      {
        src: '/images/experience/makentu-booth-jarvis.jpg',
        kind: 'photo',
        alt: {
          zh: 'MakeNTU 現場的 Jarvis 原型與隊伍看板',
          en: 'Jarvis prototype and team board at MakeNTU',
        },
        caption: {
          zh: 'MakeNTU 現場展示的 Jarvis 原型，包含表情螢幕、實體外殼與隊伍資訊。',
          en: 'Jarvis prototype at MakeNTU, showing the expression display, physical enclosure, and team board.',
        },
        position: '48% 56%',
      },
      {
        src: '/images/experience/makentu-first-prize.jpg',
        kind: 'photo',
        alt: {
          zh: 'MakeNTU NXP x AVNET 第一名合照',
          en: 'MakeNTU NXP x AVNET first prize photo',
        },
        caption: {
          zh: 'MakeNTU 2026 NXP x AVNET 企業命題第一名現場。',
          en: 'First prize at the MakeNTU 2026 NXP x AVNET challenge.',
        },
      },
      {
        src: '/images/experience/makentu-prototype.jpg',
        kind: 'photo',
        alt: {
          zh: 'Jarvis 原型展示',
          en: 'Jarvis prototype display',
        },
        caption: {
          zh: '結合 AI 對話、表情、家電控制與微控制器的人機互動原型。',
          en: 'Interactive prototype combining AI dialogue, expression, appliance control, and microcontrollers.',
        },
      },
    ],
    evidence: [],
    links: [
      {
        label: { zh: 'MakeNTU 專案 repo', en: 'MakeNTU project repo' },
        href: 'https://github.com/Ktliu-Tyler/MakeNTU_NXP_AVNET',
      },
    ],
    articleSlug: 'jarvis-smart-life',
  },
  {
    slug: 'bouteleur-smart-home-iot',
    category: 'course',
    type: 'Engineering Project',
    period: 'Sep 2024 - Dec 2025',
    year: '2024-2025',
    featured: true,
    title: {
      zh: 'BOUTELEUR 智能管家中控台',
      en: 'BOUTELEUR Smart Home Control Console',
    },
    role: {
      zh: '類比電子學實務課程專題開發者',
      en: 'Analog Electronics Practice course project developer',
    },
    summary: {
      zh: '以 Node.js、MQTT、ESP8266/ESP32、紅外線訊號、DHT11 與 MPU6050 建立低成本智慧家電控制系統。',
      en: 'Built a low-cost smart-home control system with Node.js, MQTT, ESP8266/ESP32, IR signals, DHT11, and MPU6050.',
    },
    story: [
      {
        zh: 'BOUTELEUR 是我大學第一堂實務課的完整產品式專題，從 Blynk 限制一路迭代到本地 MQTT 與自製網頁介面。',
        en: 'BOUTELEUR was my first full product-like university practice project, iterating from Blynk limitations toward local MQTT and a custom web interface.',
      },
      {
        zh: '它把家電控制、訊號登錄、環境監控、紅外線協定與魔法棒手勢控制整合在同一個中控台裡。',
        en: 'It combined appliance control, signal registration, environment monitoring, IR protocols, and wand-like gesture control into one console.',
      },
    ],
    highlights: [
      {
        zh: '以 MQTT subscribe/publish 架構取代 Blynk，支援多裝置與多端控制。',
        en: 'Replaced Blynk with an MQTT subscribe/publish architecture for multi-device control.',
      },
      {
        zh: '解碼並儲存不同品牌紅外線訊號，讓家電能透過同一介面操作。',
        en: 'Decoded and stored IR signals from different brands for unified appliance control.',
      },
      {
        zh: '測試紅外線發射距離、訊號強度與低成本實作可行性。',
        en: 'Tested IR range, signal strength, and low-cost implementation feasibility.',
      },
    ],
    skills: ['Node.js', 'MQTT', 'ESP8266', 'ESP32', 'IR Remote', 'MPU6050', 'DHT11'],
    images: [
      {
        src: '/images/experience/bouteleur-ui.jpg',
        kind: 'screenshot',
        alt: {
          zh: 'BOUTELEUR 網頁控制介面',
          en: 'BOUTELEUR web control interface',
        },
        caption: {
          zh: '裝置選擇、紅外線碼上傳與環境監控的本地網頁介面。',
          en: 'Local web interface for device selection, IR code upload, and environment monitoring.',
        },
      },
      {
        src: '/images/experience/bouteleur-device.jpg',
        kind: 'screenshot',
        alt: {
          zh: 'BOUTELEUR 裝置畫面',
          en: 'BOUTELEUR device screen',
        },
        caption: {
          zh: '紅外線與感測模組開發紀錄。',
          en: 'Development record of IR and sensor modules.',
        },
      },
    ],
    evidence: [],
    articleSlug: 'bouteleur-smart-home-iot',
  },
  {
    slug: 'aero-carrier-drone',
    category: 'course',
    type: 'Engineering Project',
    period: 'Spring 2026',
    year: '2026',
    featured: true,
    title: {
      zh: 'Aero Carrier 空地整合式無人機載具',
      en: 'Aero Carrier Air-Ground Integrated Drone Vehicle',
    },
    role: {
      zh: '電控設計、調參測試、機電系統處理',
      en: 'Electrical control, tuning, testing, and mechatronic integration',
    },
    summary: {
      zh: '機械工程實務期末專題，設計可搬運球體的空地整合載具，歷經機架、材料、控制策略與任務測試迭代。',
      en: 'A mechanical engineering practice project building an air-ground carrier for ball transport, iterating through frame design, materials, control strategy, and mission tests.',
    },
    story: [
      {
        zh: '這個專題讓我在課堂尺度裡完整經歷工程迭代：期中遇到氣壓計失效、傾覆與結構損壞，期末則透過系統性修正完成穩定版本。',
        en: 'This project gave me a complete engineering iteration cycle: midterm failures included barometer problems, rollover, and structural damage, while the final version became stable through systematic fixes.',
      },
      {
        zh: '我的分工集中在電控設計、調參測試與機電系統問題處理，必須讓飛行、地面取球與任務流程互相配合。',
        en: 'My responsibility centered on electrical control, tuning, testing, and mechatronic troubleshooting, making flight, ground pickup, and mission flow work together.',
      },
    ],
    highlights: [
      {
        zh: '參與無人機控制調參與任務流程測試，處理高度偵測與穩定性問題。',
        en: 'Worked on drone control tuning and mission testing, addressing altitude sensing and stability.',
      },
      {
        zh: '配合機構組迭代空地整合架構，降低控制複雜度並提高任務成功率。',
        en: 'Coordinated with mechanism design to iterate the air-ground architecture and improve task reliability.',
      },
      {
        zh: '建立測試紀錄與問題分析，支撐期末版本的設計修正。',
        en: 'Built test records and problem analysis that supported the final design revisions.',
      },
    ],
    skills: ['Mechatronics', 'Flight Tuning', 'Electrical Control', 'Testing', 'System Integration'],
    images: [
      {
        src: '/images/experience/aero-carrier-drone.jpg',
        kind: 'photo',
        alt: {
          zh: 'Aero Carrier 無人機載具',
          en: 'Aero Carrier drone vehicle',
        },
        caption: {
          zh: '期末版本空地整合無人機載具。',
          en: 'Final air-ground integrated drone vehicle.',
        },
      },
      {
        src: '/images/experience/aero-carrier-testing.jpg',
        kind: 'photo',
        alt: {
          zh: 'Aero Carrier 測試現場',
          en: 'Aero Carrier testing setup',
        },
        caption: {
          zh: '任務測試與機構調整紀錄。',
          en: 'Mission testing and mechanism adjustment record.',
        },
      },
    ],
    evidence: [],
    articleSlug: 'aero-carrier-iteration',
  },
  {
    slug: 'deans-list-confirmed',
    category: 'honor',
    type: 'Honor',
    period: 'Oct 2025 / Apr 2026',
    year: '2025-2026',
    title: {
      zh: '臺大機械系書卷獎（已確認兩次）',
      en: "NTU Mechanical Engineering Dean's List Awards (two confirmed)",
    },
    role: {
      zh: '113-2、114-1 學期學業成績優異',
      en: 'Academic excellence in 2024-2025 Spring and 2025-2026 Fall',
    },
    summary: {
      zh: '自傳中提及大學期間三度獲得書卷獎；目前公開資料先採兩份已確認獎狀，第三次等補充證明後再正式上站。',
      en: 'The autobiography mentions three Dean\'s List awards; the public site currently shows two confirmed certificates and leaves the third pending confirmation.',
    },
    story: [
      {
        zh: '這不是只代表分數，而是代表我從大一排名三十餘名逐步提升到大三系排名第一的學習調整能力。',
        en: 'This does not only represent grades. It represents the ability to adjust learning methods, moving from around the top thirty in freshman year toward first in the department as a junior.',
      },
    ],
    highlights: [
      {
        zh: '113 學年度第 2 學期臺大工學院機械工程學系書卷獎。',
        en: "Dean's List Award for the second semester of 2024-2025.",
      },
      {
        zh: '114 學年度第 1 學期臺大工學院機械工程學系書卷獎。',
        en: "Dean's List Award for the first semester of 2025-2026.",
      },
    ],
    skills: ['Academic Excellence', 'Mechanical Engineering', 'Self-Directed Learning'],
    images: [],
    evidence: [
      {
        src: '/images/experience/dean-list-113-2-redacted.jpg',
        kind: 'certificate',
        alt: {
          zh: '113-2 書卷獎遮蔽版獎狀',
          en: 'Redacted 2024-2025 Spring Dean\'s List certificate',
        },
        caption: {
          zh: '113-2 書卷獎證明，已遮蔽個人細節。',
          en: "2024-2025 Spring Dean's List certificate with personal details redacted.",
        },
      },
      {
        src: '/images/experience/dean-list-114-1-redacted.jpg',
        kind: 'certificate',
        alt: {
          zh: '114-1 書卷獎遮蔽版獎狀',
          en: 'Redacted 2025-2026 Fall Dean\'s List certificate',
        },
        caption: {
          zh: '114-1 書卷獎證明，已遮蔽個人細節。',
          en: "2025-2026 Fall Dean's List certificate with personal details redacted.",
        },
      },
    ],
    privacyNote: {
      zh: '公開版獎狀已遮蔽學號與部分個人細節。',
      en: 'The public certificate images redact student ID and personal details.',
    },
  },
  {
    slug: 'formula-sae-japan-2025',
    category: 'racing',
    type: 'Competition',
    period: 'Sep 2025',
    year: '2025',
    title: {
      zh: 'Formula SAE Japan 2025 參賽',
      en: 'Formula SAE Japan 2025 Participation',
    },
    role: {
      zh: 'NTU Racing EV 團隊成員',
      en: 'NTU Racing EV team member',
    },
    summary: {
      zh: '與 NTU Racing 參與 2025 Formula SAE Japan，經歷靜態審查、車檢與動態項目的完整賽事流程。',
      en: 'Participated in Formula SAE Japan 2025 with NTU Racing, experiencing static judging, vehicle inspection, and dynamic events.',
    },
    story: [
      {
        zh: '國際賽事讓車隊開發不再只是校內專題，而是需要面對檢查標準、時程壓力與跨組整合的真實工程流程。',
        en: 'The international competition turned vehicle development from a campus project into a real engineering process with inspection standards, schedule pressure, and cross-division integration.',
      },
    ],
    highlights: [
      {
        zh: '參與 2025 Formula SAE Japan Monozukuri Design Competition。',
        en: 'Participated in the 2025 Formula SAE Japan Monozukuri Design Competition.',
      },
      {
        zh: '累積賽事現場測試、文件、車檢與團隊協作經驗。',
        en: 'Built experience in onsite testing, documentation, inspection, and team collaboration.',
      },
    ],
    skills: ['Formula Student', 'Vehicle Inspection', 'Team Engineering'],
    images: [
      {
        src: '/images/experience/ntu-racing-team-car.jpg',
        kind: 'photo',
        alt: {
          zh: 'NTU Racing 車隊照片',
          en: 'NTU Racing team photo',
        },
        caption: {
          zh: 'NTU Racing EV 團隊與賽車。',
          en: 'NTU Racing EV team and vehicle.',
        },
      },
    ],
    evidence: [],
  },
  {
    slug: 'hsnu-robot-research-club',
    category: 'activity',
    type: 'Leadership',
    period: 'Sep 2022 - Jun 2023',
    year: '2022-2023',
    title: {
      zh: '師大附中機器人研究社社長',
      en: 'President of HSNU Robot Research Club',
    },
    role: {
      zh: '24 人工程團隊管理、雙足機器人研究與競賽準備',
      en: 'Managed a 24-member engineering team for bipedal robotics and competitions',
    },
    summary: {
      zh: '高中時期自主學習程式、電子與機構設計，帶領社員研究雙足機器人，並安排 CAD、機構與軟硬體整合訓練。',
      en: 'In high school, self-learned programming, electronics, and mechanism design, led bipedal robotics work, and organized CAD, mechanism, and integration training.',
    },
    story: [
      {
        zh: '這是我第一次理解一台真正能動的機器人，需要感測、致動、運算與機構設計一起成立。',
        en: 'This was my first realization that a working robot needs sensing, actuation, computation, and mechanism design to succeed together.',
      },
    ],
    highlights: [
      {
        zh: '管理社團技術路線、資源分配與競賽準備。',
        en: 'Managed technical direction, resources, and competition preparation.',
      },
      {
        zh: '帶領 Inventor、SolidWorks、機構設計與技術製圖訓練。',
        en: 'Led Inventor, SolidWorks, mechanism design, and technical drawing training.',
      },
    ],
    skills: ['Leadership', 'Robotics', 'CAD', 'Mechanical Design'],
    images: [],
    evidence: [],
  },
  {
    slug: 'mechanical-camp-course-team',
    category: 'activity',
    type: 'Leadership',
    period: '2024-2026',
    year: '2024-2026',
    title: {
      zh: '臺大機械營課程與 DIY 活動設計',
      en: 'NTU Mechanical Camp Course and DIY Activity Design',
    },
    role: {
      zh: '課程組成員、活動與教學設計',
      en: 'Course team member for activity and learning design',
    },
    summary: {
      zh: '參與臺大機械營，負責課程與 DIY 活動設計，將機械工程概念轉成高中生能實作和理解的活動。',
      en: 'Joined NTU Mechanical Camp as a course-team member, turning mechanical engineering ideas into hands-on activities for high school students.',
    },
    story: [
      {
        zh: '這段經歷訓練我把工程知識講清楚：不是只完成作品，而是讓不同背景的人能理解背後原理。',
        en: 'This experience trained me to explain engineering clearly: not only making something work, but helping people from different backgrounds understand why it works.',
      },
    ],
    highlights: [
      {
        zh: '設計 DIY 課程與活動流程。',
        en: 'Designed DIY course activities and teaching flow.',
      },
      {
        zh: '協助高中生理解機械工程與實作流程。',
        en: 'Helped high school students understand mechanical engineering through practice.',
      },
    ],
    skills: ['Teaching', 'Mechanical Engineering', 'Workshop Design'],
    images: [
      {
        src: '/images/experience/mechanical-camp.jpg',
        kind: 'certificate',
        alt: {
          zh: '臺大機械營證明',
          en: 'NTU Mechanical Camp certificate',
        },
        caption: {
          zh: '臺大機械營活動證明。',
          en: 'NTU Mechanical Camp participation record.',
        },
      },
      {
        src: '/images/experience/junior-mechanical-camp.jpg',
        kind: 'certificate',
        alt: {
          zh: '小小機械營證明',
          en: 'Junior Mechanical Camp certificate',
        },
        caption: {
          zh: '小小機械營活動證明。',
          en: 'Junior Mechanical Camp participation record.',
        },
      },
    ],
    evidence: [],
  },
  {
    slug: 'goblin-game-sdl',
    category: 'software',
    type: 'Engineering Project',
    period: '2024',
    year: '2024',
    title: {
      zh: 'GOBLIN GAME C++ SDL 遊戲專題',
      en: 'GOBLIN GAME C++ SDL Course Project',
    },
    role: {
      zh: '整體架構、遊戲邏輯、角色系統與 CLion/SDL 環境建置',
      en: 'Game architecture, logic, character systems, and CLion/SDL environment setup',
    },
    summary: {
      zh: '計算機程式期末專題，負責遊戲框架、頁面切換、動畫系統、角色邏輯與 CMake/SDL 開發環境。',
      en: 'Computer programming final project covering game framework, page switching, animation systems, character logic, and CMake/SDL setup.',
    },
    story: [
      {
        zh: '這個作品是早期軟體能力的重要節點，讓我從寫小遊戲走向模組化架構、環境建置與團隊分工。',
        en: 'This project was an important early software milestone, moving me from small games toward modular architecture, environment setup, and team collaboration.',
      },
    ],
    highlights: [
      {
        zh: '建立 include/src 分層、engine 控制流程與 Page_ID 畫面切換。',
        en: 'Built include/src organization, engine control flow, and Page_ID-based screen switching.',
      },
      {
        zh: '設計 Animation class，統一管理動畫與音效。',
        en: 'Designed an Animation class to manage animation frames and sound effects.',
      },
      {
        zh: '整理 SDL + CLion 環境模板並公開給其他人使用。',
        en: 'Published an SDL + CLion environment template for others to use.',
      },
    ],
    skills: ['C++', 'SDL', 'CMake', 'Game Architecture', 'CLion'],
    images: [
      {
        src: '/images/experience/goblin-menu.jpg',
        kind: 'screenshot',
        alt: {
          zh: 'GOBLIN GAME 主選單',
          en: 'GOBLIN GAME main menu',
        },
        caption: {
          zh: 'C++ SDL 遊戲專題主選單畫面。',
          en: 'Main menu screen of the C++ SDL game project.',
        },
      },
    ],
    evidence: [],
    links: [
      {
        label: { zh: '遊戲 repository', en: 'Game repository' },
        href: 'https://github.com/Ktliu-Tyler/GOBLIN_GAME',
      },
      {
        label: { zh: 'SDL 環境模板', en: 'SDL environment template' },
        href: 'https://github.com/Ktliu-Tyler/SDL_env_clion',
      },
    ],
  },
  {
    slug: 'machine-design-projects',
    category: 'course',
    type: 'Course Record',
    period: '2025-2026',
    year: '2025-2026',
    title: {
      zh: '機械設計原理系列專題',
      en: 'Machine Design Theory Project Series',
    },
    role: {
      zh: '產品拆解、受力分析、概念設計與機構迭代',
      en: 'Product teardown, load analysis, concept design, and mechanism iteration',
    },
    summary: {
      zh: '包含有線電話拆解、折疊椅受力分析、人力塔吊與液壓夾爪設計等系列報告，累積機構分析與工程文件能力。',
      en: 'A series covering telephone teardown, foldable-chair load analysis, and a human-powered tower crane with hydraulic claw, strengthening mechanism analysis and engineering documentation.',
    },
    story: [
      {
        zh: '這些報告讓我把日常產品拆成零件、規格、材料、受力與法規限制，練習從設計意圖回推工程判斷。',
        en: 'These reports trained me to decompose everyday products into parts, specs, materials, loads, and regulatory constraints, then infer engineering decisions from design intent.',
      },
    ],
    highlights: [
      {
        zh: '分析折疊椅 125 kg 載重、支承條件與材料假設。',
        en: 'Analyzed a foldable chair under 125 kg load with support and material assumptions.',
      },
      {
        zh: '設計以旋轉輸入完成取放任務的人力塔吊與液壓夾爪。',
        en: 'Designed a torque-driven tower crane and hydraulic claw for a pick-and-place task.',
      },
    ],
    skills: ['Mechanical Design', 'FEA Thinking', 'Product Analysis', 'Technical Documentation'],
    images: [],
    evidence: [],
  },
  {
    slug: 'high-temperature-heat-pump-report',
    category: 'writing',
    type: 'Writing',
    period: '2026',
    year: '2026',
    title: {
      zh: '高溫熱泵應用報告',
      en: 'High-Temperature Heat Pump Application Report',
    },
    role: {
      zh: '研究動機、熱泵原理整理、文獻探討',
      en: 'Research motivation, heat-pump fundamentals, and literature review',
    },
    summary: {
      zh: '冷凍空調原理期末報告，以製程溫度、廢熱來源、運轉時間與經濟條件建立高溫熱泵導入判斷框架。',
      en: 'A refrigeration and air-conditioning final report using process temperature, waste-heat source, operating time, and economics to evaluate high-temperature heat pump adoption.',
    },
    story: [
      {
        zh: '這份報告代表我不只做硬體，也能整理工程文獻，把能源系統問題轉成可判斷的分析框架。',
        en: 'This report shows that beyond hardware work, I can synthesize engineering literature and turn an energy-system topic into an evaluation framework.',
      },
    ],
    highlights: [
      {
        zh: '整理 IEA、循環架構、冷媒與系統可靠度文獻。',
        en: 'Reviewed sources on IEA guidance, cycle architecture, refrigerants, and system reliability.',
      },
      {
        zh: '提出 200°C 以下、熱需求穩定且具廢熱來源的導入情境。',
        en: 'Identified adoption scenarios under 200 deg C with stable heat demand and usable waste heat.',
      },
    ],
    skills: ['Thermal Systems', 'Literature Review', 'Energy Analysis'],
    images: [],
    evidence: [],
  },
  {
    slug: 'perfume-film-literature-report',
    category: 'writing',
    type: 'Writing',
    period: '2026',
    year: '2026',
    title: {
      zh: '《香水》小說與電影視角比較',
      en: 'Perfume: Comparing Novel and Film Perspectives',
    },
    role: {
      zh: '報告者',
      en: 'Presenter',
    },
    summary: {
      zh: '比較小說的嗅覺書寫與電影的視聽轉譯，呈現除了工程外的敘事分析與表達能力。',
      en: 'Compared olfactory writing in the novel with audiovisual translation in film, showing narrative analysis and presentation beyond engineering work.',
    },
    story: [
      {
        zh: '這類非工程報告會放在完整紀錄中，不搶主軸，但保留我在表達、觀察與文本分析上的另一面。',
        en: 'This non-engineering report belongs in the full record rather than the main technical thread, but it keeps another side of my expression and analysis visible.',
      },
    ],
    highlights: [
      {
        zh: '分析氣味如何在小說中透過文字建立世界觀。',
        en: 'Analyzed how smell builds the world through text in the novel.',
      },
      {
        zh: '討論電影如何用色調、鏡頭、聲音與旁白補足嗅覺想像。',
        en: 'Discussed how film uses color, shots, sound, and narration to translate olfactory imagination.',
      },
    ],
    skills: ['Presentation', 'Narrative Analysis', 'Comparative Reading'],
    images: [],
    evidence: [],
  },
]

export function getExperienceEntry(slug: string) {
  return experienceEntries.find((entry) => entry.slug === slug)
}

export function getEntryDisplayImages(entry: ExperienceEntry) {
  return [...entry.images, ...entry.evidence].filter((image) => image.kind !== 'certificate')
}

export function getEntryCoverImage(entry: ExperienceEntry) {
  return getEntryDisplayImages(entry)[0]
}

export function getFeaturedExperienceEntries() {
  return experienceEntries.filter((entry) => entry.featured)
}

export function getExperienceSlugs() {
  return experienceEntries.map((entry) => entry.slug)
}

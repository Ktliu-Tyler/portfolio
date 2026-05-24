'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

/* ── Animation Variants ─────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

/* ── Article Content ────────────────────────────────────────────── */

function ArticleContentZH() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mt-12 mb-6">
        加入 NTU Racing Team
      </h2>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        在台灣大學機械工程系就讀期間，我有幸加入了 NTU Racing Team，並在第八屆擔任電系組組長。這段經歷徹底改變了我對工程的理解——從純機械設計轉向了嵌入式軟體開發。回頭看，這是我大學生涯中最具影響力的決定之一。
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        為什麼加入車隊
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Formula Student 方程式賽車是全球大學工程競賽中最具挑戰性的項目之一。車隊需要從零開始設計、製造並測試一台完整的賽車——這不是某個課堂上的模擬習題，而是一台真正能在賽道上奔馳的機器。對我來說，這是將課堂知識應用於真實工程問題的最佳機會。
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        車輛的電子系統特別吸引我——每一個感測器數據、每一個控制指令都需要在毫秒級的時間內完成傳輸和處理。這種即時系統的挑戰讓我著迷。當其他同學在學習靜力學和材料力學時，我開始深入研究 CAN 匯流排協議和嵌入式程式設計。機械系的訓練給了我紮實的系統思維基礎，而車隊的實戰經驗讓我找到了真正的熱情所在。
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        電系組的工作
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        作為電系組組長，我負責整個車輛電子系統的架構設計和開發。這涵蓋了從底層硬體驅動到上層應用軟體的完整鏈路：
      </p>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          CAN 匯流排通訊
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          賽車中的所有電子控制單元（ECU）都通過 CAN 匯流排進行通訊。我開發了 CANdecoder 工具來解析和調試 CAN 訊息——它能將原始的十六進位數據包轉換為人類可讀的物理量值。同時，我打造了 rpi_can_monitor 系統，這是一個基於 Raspberry Pi 的即時車輛監控塔台，讓工程師能在場邊即時觀察車輛的每一個參數狀態。
        </p>
      </div>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          感測器整合
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          整合了各種感測器，包括 GPS 定位（LC29H 模組）、懸吊位移感測器、輪速感測器等。開發了 GPS_nturt 和 GPS_tracker 工具來處理 NMEA 數據，實現精確的車輛定位與軌跡記錄。每一顆感測器的接入都涉及通訊協議的理解、信號的濾波處理，以及與車輛主控系統的整合測試。
        </p>
      </div>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          車輛控制軟體
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          參與了基於 Zephyr RTOS 的車輛控制軟體開發（nturt_zephyr_common），包括懸吊系統控制模組。Zephyr 是一個輕量級的即時作業系統，專為資源受限的嵌入式設備設計。在這個框架下寫程式，每一行代碼都需要考慮記憶體開銷和執行時間。
        </p>
      </div>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        技術挑戰
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        嵌入式系統開發與一般軟體開發有很大不同。記憶體有限、計算資源受限、即時性要求嚴格——你沒辦法用「加更多 RAM」或「換更快的 CPU」來解決問題。每一段程式碼都必須精心優化，確保在有限的資源下穩定運行。
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        CAN 匯流排的調試特別具有挑戰性。沒有圖形化的調試工具，只能看到一串串的十六進位數據包飛過螢幕。你需要對照 DBC 文件手動計算每個信號的偏移量和縮放因子。這正是促使我開發 CANdecoder 的原因——將原始的數據流轉化為有意義的工程數據。
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        另一個巨大的挑戰是跨組協作。車隊由機械組、電系組、車身組等多個部門組成，每個決策都會影響其他組別的工作。學會與不同背景的人溝通技術需求，是我在車隊學到最寶貴的軟技能之一。
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        收穫與成長
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        這段經歷讓我成長為一個更全面的工程師。我學會了團隊協作、專案管理，以及如何在壓力下交付高品質的系統。更重要的是，我找到了自己真正的技術方向——嵌入式系統與軟硬體整合。
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        在車隊的日子裡，我不只是一個寫程式的工程師，更是一個需要理解整台車輛運作邏輯的系統設計者。從感測器的選型到通訊協議的設計，從底層驅動到上層的監控界面，每一個環節都要求精確和可靠。這種端到端的系統思維，是在任何課堂上都學不到的。
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        如果你也是大學生，正在猶豫要不要加入一個技術性的學生團隊，我的建議是：不要猶豫，現在就去做。你會發現課堂之外才是真正學習的開始。
      </p>
    </>
  )
}

function ArticleContentEN() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mt-12 mb-6">
        Joining NTU Racing Team
      </h2>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        While studying Mechanical Engineering at National Taiwan University, I joined NTU Racing Team and served as the Electrical Division Lead for the 8th generation. The role expanded my engineering focus from mechanical design toward embedded software, vehicle electronics, and systems integration.
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Why I Joined the Team
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Formula Student is one of the most demanding university engineering competitions in the world. Teams must design, manufacture, and test a complete race car, creating a direct bridge between classroom theory and track-tested engineering decisions.
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        The vehicle&apos;s electronic systems were especially valuable from a software perspective: every sensor reading and control command must be transmitted, decoded, and processed within tight timing constraints. My mechanical engineering training provided systems-level context, while the team environment gave me practical experience with CAN bus communication and embedded development.
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Work in the Electrical Division
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        As the Electrical Division Lead, I was responsible for the architecture design and development of the entire vehicle electronic system. This covered the complete chain from low-level hardware drivers to high-level application software:
      </p>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          CAN Bus Communication
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          All Electronic Control Units (ECUs) in the race car communicate through the CAN bus. I developed the CANdecoder tool for parsing and debugging CAN messages—converting raw hexadecimal data packets into human-readable physical values. Additionally, I built the rpi_can_monitor system, a Raspberry Pi-based real-time vehicle telemetry monitoring station that enables engineers to observe every vehicle parameter in real-time trackside.
        </p>
      </div>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          Sensor Integration
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          Integrated various sensors including GPS positioning (LC29H module), suspension displacement sensors, wheel speed sensors, and more. Developed the GPS_nturt and GPS_tracker tools for processing NMEA data, enabling precise vehicle positioning and trajectory recording. Each sensor integration involved understanding communication protocols, signal filtering, and integration testing with the vehicle&apos;s main control system.
        </p>
      </div>

      <div className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-lg font-heading font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          Vehicle Control Software
        </h4>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          Contributed to vehicle control software development based on Zephyr RTOS (nturt_zephyr_common), including the suspension system control module. Zephyr is a lightweight real-time operating system designed for resource-constrained embedded devices. Writing code in this framework requires consideration of memory overhead and execution time for every single line.
        </p>
      </div>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Technical Challenges
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Embedded systems development differs significantly from general software development. Limited memory, constrained computing resources, strict real-time requirements—you can&apos;t just &quot;add more RAM&quot; or &quot;use a faster CPU&quot; to solve problems. Every piece of code must be carefully optimized to run reliably within limited resources.
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Debugging the CAN bus was particularly challenging. Without graphical debugging tools, you can only watch streams of hexadecimal data packets flying across your screen. You need to manually calculate each signal&apos;s offset and scaling factor by cross-referencing DBC files. This frustration is precisely what motivated me to develop CANdecoder—transforming raw data streams into meaningful engineering data.
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Another massive challenge was cross-team collaboration. The racing team consists of multiple divisions—mechanical, electrical, body, and more—where every decision impacts other groups&apos; work. Learning to communicate technical requirements with people from different backgrounds was one of the most valuable soft skills I gained from the team.
      </p>

      <h3 className="text-xl sm:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        What I Gained
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        This experience helped me grow into a more well-rounded engineer. I learned teamwork, project management, and how to deliver high-quality systems under pressure. More importantly, I found my true technical direction—embedded systems and hardware-software integration.
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        During my time with the racing team, I wasn&apos;t just a programmer—I was a systems designer who needed to understand the operational logic of an entire vehicle. From sensor selection to communication protocol design, from low-level drivers to high-level monitoring interfaces, every component demanded precision and reliability. This end-to-end systems thinking is something you can never learn in any classroom.
      </p>
      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        If you&apos;re a university student wondering whether to join a technical student team, my advice is: don&apos;t hesitate—just go do it. You&apos;ll discover that real learning begins outside the classroom.
      </p>
    </>
  )
}

/* ── Page Component ─────────────────────────────────────────────── */

export default function RacingTeamArticle() {
  const { t, locale } = useTranslation()

  const title = t('blog.articles.racing.title')
  const date = t('blog.articles.racing.date')
  const readTime = t('blog.articles.racing.readTime')
  const tagsStr = t('blog.articles.racing.tags')
  const tags = tagsStr.split(',')

  return (
    <main className="min-h-screen bg-white dark:bg-[#0C1120]">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* ── Back Button ─────────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('blog.back')}
          </Link>
        </motion.div>

        {/* ── Banner Image ────────────────────────────────────────── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative aspect-video rounded-2xl overflow-hidden mb-10"
        >
          <Image
            src="/images/racing.png"
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>

        {/* ── Title ───────────────────────────────────────────────── */}
        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-6"
        >
          {title}
        </motion.h1>

        {/* ── Meta ────────────────────────────────────────────────── */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-white/[0.08]"
        >
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{readTime} {t('blog.min_read')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Article Content ─────────────────────────────────────── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {locale === 'zh' ? <ArticleContentZH /> : <ArticleContentEN />}
        </motion.div>

        {/* ── Bottom Navigation ───────────────────────────────────── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 pt-8 border-t border-slate-200 dark:border-white/[0.08]"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-white/[0.08]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.back')}
          </Link>
        </motion.div>
      </article>
    </main>
  )
}

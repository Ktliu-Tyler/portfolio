'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

export default function DevJourneyArticle() {
  const { t, locale } = useTranslation()

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('blog.back')}
          </Link>
        </motion.div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-8"
        >
          <Image
            src="/images/journey.png"
            alt="Software and embedded systems project timeline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {t('blog.articles.journey.title')}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {t('blog.articles.journey.date')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {t('blog.articles.journey.readTime')} {t('blog.min_read')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {t('blog.articles.journey.tags').split(',').map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/25 rounded-full text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-heading prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:gradient-text
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-slate-200
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-indigo-300
            prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-ul:text-slate-300 prose-li:mb-2
          "
        >
          {locale === 'zh' ? (
            <>
              <h2>開始的地方</h2>
              <p>
                2021 年，我第一次打開終端機，輸入 <code>python</code>。那時候的我是一個純粹的機械工程系
                新生，對程式設計一無所知。我不知道什麼是變數、什麼是迴圈，更不知道程式碼能夠帶我走多遠。
                但就是那一行 <code>print(&quot;Hello, World!&quot;)</code>，開啟了我一段充滿驚喜的旅程。
              </p>
              <p>
                回想起來，最讓我著迷的是程式設計的即時反饋。寫一行程式碼，按下執行，立刻看到結果。
                這和機械設計中漫長的製造和測試週期完全不同。這種快速迭代的能力讓我深深著迷。
              </p>

              <h2>2021：起步探索</h2>
              <p>
                學會 Python 基礎後，我迫不及待地想做一些有意義的專案。我的第一個正式專案是
                <strong>LaserRecognition</strong>——一個雷射辨識系統。使用 OpenCV 進行電腦視覺處理，
                我第一次體驗到了用程式碼與實體世界互動的樂趣。看著螢幕上的程式能夠即時追蹤雷射光點的
                位置，那種成就感至今難忘。
              </p>
              <p>
                同年，我還開發了 <strong>HospitalBED Transportation System</strong>——一個自動化病床
                傳送系統。這是一個更具挑戰性的專案，需要考慮路徑規劃和控制邏輯。雖然現在回頭看，
                當時的程式碼寫得很粗糙，但它讓我學會了如何將一個複雜問題拆解成可管理的小塊。
              </p>

              <h2>2022：多元嘗試</h2>
              <p>
                2022 年是我最瘋狂的一年。我幾乎什麼都想嘗試，做了五個截然不同的專案。
              </p>
              <p>
                首先是遊戲開發。我用 Python 的 Pygame 做了 <strong>Space Fighter</strong>——一款太空射擊
                遊戲。這是我第一次接觸遊戲開發的概念：遊戲循環、碰撞檢測、精靈渲染、狀態管理。
                做完 Python 版之後不過癮，我又用 C++ 重新寫了一個進階版 <strong>Space Travel</strong>。
                這次讓我真正理解了 C++ 和 Python 在效能和記憶體管理上的差異。
              </p>
              <p>
                <strong>MusicPlayer</strong> 是一個桌面音樂播放器。看起來簡單，但它教會了我 GUI
                程式設計的基礎，以及如何處理音訊檔案和播放控制。
              </p>
              <p>
                <strong>Model Creater</strong> 讓我接觸了 3D 圖形的世界。這個工具能夠根據參數生成幾何
                模型，為我後來學習 Three.js 打下了基礎。
              </p>
              <p>
                最特別的是 <strong>Bird Sound Recognition</strong>——一個鳥聲辨識系統。這是我第一次
                接觸機器學習，學習了音訊特徵提取、頻譜分析和分類模型。雖然辨識率不算很高，但整個
                機器學習的 pipeline 讓我大開眼界。
              </p>

              <h2>2023：深入開發</h2>
              <p>
                經過兩年的多元嘗試，2023 年我開始專注於更有深度的專案。
              </p>
              <p>
                <strong>GOBLIN GAME</strong> 是我在計算機程式專題課程中的作品，也是我到目前為止最大型
                的專案。使用 C++ 和 SDL（Simple DirectMedia Layer）開發，我負責整體遊戲架構設計、
                遊戲邏輯、運行時功能和角色系統。
              </p>
              <p>
                這個專案教會了我太多東西：軟體架構的重要性、設計模式的應用、團隊協作的溝通技巧，
                以及在 Windows 上用 CMake 管理 C++ 專案的「樂趣」。為了解決 SDL 在 CLion 上的
                環境配置問題，我還另外建立了 <strong>SDL_env_clion</strong> 開發環境模板，
                分享給其他同學使用。
              </p>

              <h2>2024：工具與系統</h2>
              <p>
                到了 2024 年，我開始轉向開發更實用的工具和系統。
              </p>
              <p>
                <strong>Stock Analysis Taiwan</strong> 是一個台灣股市分析工具。它能自動爬取股市數據，
                計算各種技術分析指標，並以視覺化的方式呈現。這個專案讓我學會了 Web API 的使用、
                數據處理 pipeline 的設計，以及如何用 pandas 進行大規模數據分析。
              </p>
              <p>
                <strong>Simplexmotion Modbus</strong> 是一個通過 RS485 Modbus RTU 協議控制
                SimplexMotion 馬達的 Python 函式庫。這是我第一次接觸工業通訊協議，學習了序列通訊、
                寄存器操作和馬達控制的原理。這個經驗為後來在車隊中處理 CAN 匯流排打下了堅實基礎。
              </p>

              <h2>2025–2026：車隊與 IoT</h2>
              <p>
                加入 NTU Racing Team 並擔任第八屆電系組組長，是我程式生涯的一個重要轉折點。
                在這裡，我開發了一系列與車輛電子相關的工具：
              </p>
              <ul>
                <li><strong>CANdecoder</strong>：CAN 匯流排數據解碼工具，支援 DBC 文件解析</li>
                <li><strong>GPS_nturt</strong> 和 <strong>GPS_tracker</strong>：GPS 定位和軌跡記錄工具</li>
                <li><strong>rpi_can_monitor</strong>：基於 Raspberry Pi 的即時車輛監控塔台</li>
              </ul>
              <p>
                同時期，我也開始探索 IoT 領域。<strong>IR Remote IoT</strong> 和 <strong>IoT Controller</strong>
                是我的紅外線智慧家居專案，使用 ESP32 和 ESP8266 實現家電的遠端控制。
                這讓我對物聯網架構和嵌入式開發有了更深入的理解。
              </p>
              <p>
                而你現在正在瀏覽的這個 <strong>Portfolio</strong> 網站，也是這個時期的作品。
                用 Next.js、TypeScript、Three.js 和 Framer Motion 打造的現代雙語網站，
                是我前端技術的一次綜合展示。
              </p>

              <h2>未來展望</h2>
              <p>
                回顧這五年的歷程，從一個什麼都不會的機械系新生，到現在能夠獨立開發各種軟體系統，
                我深深感受到程式設計帶來的無限可能。
              </p>
              <p>
                未來，我希望繼續深入嵌入式系統和 IoT 的領域，探索邊緣計算和 AI 在嵌入式設備上的
                應用。同時，我也想將更多的精力投入到開源社區中，分享自己的工具和經驗，幫助更多
                像當年的我一樣剛開始學程式的人。
              </p>
              <p>
                程式設計之旅永遠沒有終點，而我才剛剛起步。
              </p>
            </>
          ) : (
            <>
              <h2>Starting Point</h2>
              <p>
                I began programming in 2021 while studying Mechanical Engineering at National Taiwan
                University. Starting with Python fundamentals, I gradually moved from small experiments
                to tools that interact with data, hardware, and real engineering workflows.
              </p>
              <p>
                What stood out early was the speed of iteration. Compared with mechanical design cycles,
                software allowed me to prototype, test, and refine ideas quickly. That feedback loop
                became a major reason I continued investing in software and embedded systems.
              </p>

              <h2>2021: Foundations</h2>
              <p>
                After learning Python basics, my first applied project was
                <strong>LaserRecognition</strong>, a laser detection system built with OpenCV. It
                introduced me to computer vision, image-processing pipelines, and the value of connecting
                software output to physical-world measurements.
              </p>
              <p>
                That same year, I developed the <strong>HospitalBED Transportation System</strong>—an
                automated hospital bed transport system. This was a more challenging project that required
                path planning and control logic. Looking back, the code was rough, but it taught me how
                to break complex problems into manageable pieces.
              </p>

              <h2>2022: Exploration</h2>
              <p>
                In 2022, I explored several software domains to build a broader technical foundation.
              </p>
              <p>
                First came game development. I built <strong>Space Fighter</strong> with Python&apos;s Pygame—a
                space shooter game. This was my first encounter with game development concepts: game loops,
                collision detection, sprite rendering, state management. Not satisfied with just the Python
                version, I rebuilt it in C++ as <strong>Space Travel</strong>. This taught me the real
                differences between C++ and Python in terms of performance and memory management.
              </p>
              <p>
                <strong>MusicPlayer</strong> was a desktop music player. Simple in appearance, but it
                taught me GUI programming fundamentals and how to handle audio files and playback controls.
              </p>
              <p>
                <strong>Model Creater</strong> introduced me to the world of 3D graphics. This tool
                could generate geometric models based on parameters, laying groundwork for my later
                learning of Three.js.
              </p>
              <p>
                The most unique project was <strong>Bird Sound Recognition</strong>—a bird species
                classifier through audio. This was my first encounter with machine learning: audio feature
                extraction, spectral analysis, and classification models. While the accuracy wasn&apos;t
                exceptional, the project introduced me to a complete machine-learning workflow from
                data preparation to model evaluation.
              </p>

              <h2>2023: Systems Practice</h2>
              <p>
                After two years of diverse experimentation, I started focusing on deeper projects in 2023.
              </p>
              <p>
                <strong>GOBLIN GAME</strong> was my computer programming course project and the largest
                project I&apos;d undertaken. Built with C++ and SDL (Simple DirectMedia Layer), I was
                responsible for overall architecture design, game logic, runtime functionality, and
                character systems.
              </p>
              <p>
                This project strengthened my understanding of software architecture, design patterns,
                team collaboration, and C++ build management with CMake on Windows. To solve SDL
                environment setup issues in CLion, I created the
                <strong>SDL_env_clion</strong> development environment template and shared it with classmates.
              </p>

              <h2>2024: Tools & Systems</h2>
              <p>
                By 2024, I shifted toward building more practical tools and systems.
              </p>
              <p>
                <strong>Stock Analysis Taiwan</strong> is a Taiwan stock market analysis tool. It
                automatically scrapes market data, calculates various technical analysis indicators, and
                presents them visually. This project taught me Web API usage, data processing pipeline
                design, and large-scale data analysis with pandas.
              </p>
              <p>
                <strong>Simplexmotion Modbus</strong> is a Python library for controlling SimplexMotion
                motors via RS485 Modbus RTU protocol. This was my first encounter with industrial
                communication protocols—learning serial communication, register operations, and motor
                control principles. This experience laid a solid foundation for later CAN bus work
                with the racing team.
              </p>

              <h2>2025–2026: Racing & IoT</h2>
              <p>
                Joining NTU Racing Team as the 8th generation Electrical Division Lead was a pivotal
                moment in my programming career. Here, I developed a series of vehicle electronics tools:
              </p>
              <ul>
                <li><strong>CANdecoder</strong>: CAN bus data decoder with DBC file parsing support</li>
                <li><strong>GPS_nturt</strong> and <strong>GPS_tracker</strong>: GPS positioning and trajectory tools</li>
                <li><strong>rpi_can_monitor</strong>: Raspberry Pi-based real-time vehicle monitoring station</li>
              </ul>
              <p>
                Concurrently, I began exploring IoT. <strong>IR Remote IoT</strong> and <strong>IoT
                Controller</strong> are my smart home projects using ESP32 and ESP8266 for remote
                appliance control via infrared. These deepened my understanding of IoT architecture
                and embedded development.
              </p>
              <p>
                I also built this <strong>Portfolio</strong> website during this period using Next.js,
                TypeScript, Three.js, and Framer Motion to present my work in a more structured format.
              </p>

              <h2>Looking Forward</h2>
              <p>
                Reflecting on these five years, from a mechanical engineering freshman who knew nothing
                about programming to someone who can independently develop various software systems, I&apos;ve
                deeply felt the infinite possibilities that programming brings.
              </p>
              <p>
                Going forward, I plan to deepen my work in embedded systems, IoT, vehicle telemetry,
                and edge computing. I also want to make selected tools and technical notes easier for
                others to reference and reuse.
              </p>
              <p>
                This portfolio records that progression and will continue to evolve as my technical
                work becomes more focused.
              </p>
            </>
          )}
        </motion.div>

        {/* Back to blog */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('blog.back')}
          </Link>
        </motion.div>
      </article>
    </main>
  )
}

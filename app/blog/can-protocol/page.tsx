'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

export default function CanProtocolArticle() {
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
            src="/images/embedded.png"
            alt="CAN Protocol"
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
            {t('blog.articles.can.title')}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {t('blog.articles.can.date')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {t('blog.articles.can.readTime')} {t('blog.min_read')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {t('blog.articles.can.tags').split(',').map((tag, i) => (
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
              <h2>什麼是 CAN 協議</h2>
              <p>
                CAN（Controller Area Network，控制器區域網路）是一種專為車輛和工業環境設計的序列通訊協議。
                它由 Robert Bosch GmbH 在 1980 年代開發，最初是為了減少汽車內部的線束重量和複雜度。
                在 CAN 出現之前，車輛中的每個電子設備都需要獨立的線路連接，隨著車輛電子設備的增加，
                線束變得越來越龐大。CAN 協議讓所有設備共享同一條匯流排，大幅簡化了佈線。
              </p>
              <p>
                如今，CAN 已經成為汽車電子的標準通訊協議，幾乎每一台現代汽車都使用 CAN 匯流排來連接
                引擎控制單元（ECU）、變速箱控制器、ABS 系統、儀表板、車身控制模組等各種電子設備。
                在 NTU Racing Team 中，我們的方程式賽車也大量使用 CAN 匯流排來連接各個控制系統。
              </p>

              <h2>CAN 的技術特點</h2>
              <h3>差動信號傳輸</h3>
              <p>
                CAN 使用差動信號（CAN_H 和 CAN_L 兩條線）來傳輸數據。這種設計讓它具有極強的
                抗干擾能力——即使在電磁環境嚴苛的汽車引擎室內也能穩定工作。差動信號的原理很簡單：
                接收端只關心兩條線之間的電壓差，而不是絕對電壓值，因此共模干擾可以被有效消除。
              </p>

              <h3>廣播機制與優先級仲裁</h3>
              <p>
                CAN 採用廣播式通訊——每個節點發送的訊息都可以被所有其他節點接收。每個訊息都有一個
                唯一的 ID，節點可以透過濾波器選擇性地接收感興趣的訊息。當多個節點同時嘗試發送時，
                CAN 使用非破壞性的位元仲裁機制：ID 值較小的訊息具有較高的優先級，可以繼續發送，
                而其他節點則自動退讓。這保證了重要的控制訊息（如煞車指令）總是能優先傳輸。
              </p>

              <h3>錯誤檢測</h3>
              <p>
                CAN 協議內建了五種錯誤檢測機制：循環冗餘校驗（CRC）、幀格式檢查、ACK 確認、
                位元填充和位元監控。這些機制讓 CAN 的數據傳輸非常可靠，錯誤率極低。
              </p>

              <h2>CAN 訊框結構</h2>
              <p>
                CAN 訊框由多個場域組成。<strong>標準幀</strong>使用 11 位元的 ID（CAN 2.0A），
                <strong>擴展幀</strong>使用 29 位元的 ID（CAN 2.0B）。訊框中的仲裁場決定了訊息的
                優先級，數據場可以攜帶 0 到 8 個位元組的數據。在我們的賽車中，不同的 ECU 使用不同的
                CAN ID 來標識它們的訊息，例如引擎轉速可能使用 ID 0x100，而懸吊位移可能使用 ID 0x200。
              </p>

              <h2>DBC 檔案格式</h2>
              <p>
                DBC（Database CAN）檔案是一種描述 CAN 網路中所有訊息和信號定義的資料庫格式。
                它定義了每個 CAN ID 對應的訊息名稱、每個訊息中包含的信號、信號的位元位置、
                長度、縮放因子、偏移量和物理單位等資訊。
              </p>
              <p>
                舉例來說，一個 DBC 檔案可能定義了 ID 為 0x100 的訊息 &ldquo;EngineData&rdquo;，
                其中位元 0-15 是引擎轉速（RPM），位元 16-23 是冷卻水溫度（°C）。有了這個定義，
                我們就能將原始的十六進位數據自動轉換為有意義的物理值。
              </p>

              <h2>CANdecoder 開發過程</h2>
              <p>
                在車隊開發和測試過程中，我們需要快速分析大量的 CAN 數據。市面上雖然有 SavvyCAN
                等工具，但我們需要一個更輕量、可以自動化的解決方案。於是我開發了 CANdecoder。
              </p>
              <p>
                CANdecoder 使用 Python 的 <code>cantools</code> 函式庫來解析 DBC 檔案，然後將
                原始的 CAN 數據（通常以 .blf 或 .asc 格式記錄）解碼為人類可讀的信號值。
                解碼後的數據以 CSV 格式輸出，方便使用 Excel 或 Python pandas 進行進一步分析。
              </p>

              <h2>rpi_can_monitor：即時監控系統</h2>
              <p>
                除了離線分析工具，我還開發了 rpi_can_monitor——一個基於 Raspberry Pi 的即時 CAN
                數據監控系統。這個系統作為車隊的「監控塔台」，可以在測試和比賽時即時顯示車輛的
                各項參數，如引擎轉速、車速、電池電壓、懸吊行程等。
              </p>
              <p>
                透過 Raspberry Pi 上的 MCP2515 CAN 控制器和 SocketCAN 介面，系統能夠即時
                接收 CAN 數據，解碼後以圖形化的方式呈現。這讓工程師可以在賽道旁即時監控車輛狀態，
                快速發現問題並做出調整。
              </p>

              <h2>實際應用與心得</h2>
              <p>
                在 NTU Racing Team 的實踐中，我深刻體會到 CAN 協議在汽車電子中的核心地位。
                從設計通訊架構、定義 DBC 文件、開發解碼工具到建立監控系統，每一步都讓我對
                嵌入式系統有了更深的理解。這些經驗不僅適用於賽車，在工業自動化、智慧交通、
                甚至是 IoT 領域都有廣泛的應用價值。
              </p>
            </>
          ) : (
            <>
              <h2>What is the CAN Protocol</h2>
              <p>
                CAN (Controller Area Network) is a serial communication protocol specifically designed
                for vehicles and industrial environments. Developed by Robert Bosch GmbH in the 1980s,
                it was originally created to reduce the weight and complexity of wiring harnesses in
                automobiles. Before CAN, each electronic device in a vehicle required its own dedicated
                wiring connections. As vehicles incorporated more electronics, the wiring became
                increasingly massive. CAN allowed all devices to share a single bus, dramatically
                simplifying the wiring architecture.
              </p>
              <p>
                Today, CAN has become the standard communication protocol in automotive electronics.
                Virtually every modern car uses CAN bus to connect Engine Control Units (ECUs),
                transmission controllers, ABS systems, dashboards, body control modules, and various
                other electronic devices. At NTU Racing Team, our formula race car also extensively
                uses CAN bus to connect all control systems.
              </p>

              <h2>Technical Features of CAN</h2>
              <h3>Differential Signal Transmission</h3>
              <p>
                CAN uses differential signaling (CAN_H and CAN_L lines) for data transmission. This
                design provides excellent noise immunity—it can operate reliably even in the
                electromagnetically harsh environment of a car engine bay. The principle is
                straightforward: the receiver only cares about the voltage difference between the two
                lines, not the absolute voltage, so common-mode interference is effectively eliminated.
              </p>

              <h3>Broadcasting and Priority Arbitration</h3>
              <p>
                CAN uses broadcast communication—messages sent by any node can be received by all other
                nodes. Each message has a unique ID, and nodes can selectively receive messages of
                interest through filters. When multiple nodes attempt to transmit simultaneously, CAN
                uses a non-destructive bitwise arbitration mechanism: messages with lower ID values have
                higher priority and can continue transmitting, while other nodes automatically back off.
                This ensures that critical control messages (like brake commands) always get priority.
              </p>

              <h3>Error Detection</h3>
              <p>
                The CAN protocol includes five built-in error detection mechanisms: Cyclic Redundancy
                Check (CRC), frame format checking, ACK verification, bit stuffing, and bit monitoring.
                These mechanisms make CAN data transmission highly reliable with extremely low error rates.
              </p>

              <h2>CAN Frame Structure</h2>
              <p>
                A CAN frame consists of multiple fields. <strong>Standard frames</strong> use an 11-bit
                ID (CAN 2.0A), while <strong>extended frames</strong> use a 29-bit ID (CAN 2.0B). The
                arbitration field determines message priority, and the data field can carry 0 to 8 bytes
                of payload. In our race car, different ECUs use different CAN IDs to identify their
                messages—for example, engine RPM might use ID 0x100, while suspension displacement
                might use ID 0x200.
              </p>

              <h2>DBC File Format</h2>
              <p>
                DBC (Database CAN) files are a database format that describes all message and signal
                definitions in a CAN network. They define the message name for each CAN ID, the
                signals contained in each message, along with each signal&apos;s bit position, length,
                scaling factor, offset, and physical units.
              </p>
              <p>
                For example, a DBC file might define a message &ldquo;EngineData&rdquo; with ID 0x100,
                where bits 0-15 represent engine RPM and bits 16-23 represent coolant temperature (°C).
                With this definition, we can automatically convert raw hexadecimal data into meaningful
                physical values.
              </p>

              <h2>Building CANdecoder</h2>
              <p>
                During racing team development and testing, we needed to quickly analyze large volumes
                of CAN data. While tools like SavvyCAN exist, we needed a lighter, automatable solution.
                That&apos;s why I built CANdecoder.
              </p>
              <p>
                CANdecoder uses Python&apos;s <code>cantools</code> library to parse DBC files, then
                decodes raw CAN data (typically recorded in .blf or .asc format) into human-readable
                signal values. The decoded data is exported in CSV format, making it easy to perform
                further analysis using Excel or Python pandas.
              </p>

              <h2>rpi_can_monitor: Real-time Monitoring</h2>
              <p>
                Beyond offline analysis tools, I also developed rpi_can_monitor—a Raspberry Pi-based
                real-time CAN data monitoring system. This system serves as the team&apos;s &ldquo;monitoring
                station,&rdquo; displaying real-time vehicle parameters during testing and competitions,
                such as engine RPM, vehicle speed, battery voltage, and suspension travel.
              </p>
              <p>
                Through the MCP2515 CAN controller and SocketCAN interface on the Raspberry Pi, the
                system receives CAN data in real-time, decodes it, and presents it graphically. This
                allows engineers to monitor vehicle status trackside, quickly identify issues, and
                make adjustments on the fly.
              </p>

              <h2>Practical Application</h2>
              <p>
                Through my work at NTU Racing Team, I have used CAN communication across the complete
                data workflow: communication architecture, DBC definition, decoding tools, and real-time
                monitoring. The same principles are relevant beyond motorsport, including industrial
                automation, transportation systems, and IoT devices.
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

export interface ArticleSection {
  heading: string
  body?: string[]
  bullets?: string[]
}

export interface ArticleSummary {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  image: string
  sourceRepos?: Array<{
    name: string
    url: string
  }>
}

export interface TechnicalArticle extends ArticleSummary {
  sections: ArticleSection[]
}

export const existingArticleSummaries: ArticleSummary[] = [
  {
    slug: 'racing-team',
    title: 'Building Embedded Software in NTU Racing Team',
    excerpt:
      'A technical reflection on vehicle electronics, embedded software responsibilities, and the transition from mechanical engineering to systems development.',
    date: '2026-05-20',
    readTime: '8',
    tags: ['NTU Racing', 'Embedded', 'CAN Bus'],
    image: '/images/racing.png',
  },
  {
    slug: 'can-protocol',
    title: 'CAN Bus Fundamentals for Vehicle Telemetry',
    excerpt:
      'An overview of CAN communication, DBC-based decoding, and practical tooling for vehicle data analysis.',
    date: '2026-05-15',
    readTime: '10',
    tags: ['CAN Bus', 'Automotive', 'Python'],
    image: '/images/embedded.png',
  },
  {
    slug: 'dev-journey',
    title: 'From Python Projects to Embedded Systems',
    excerpt:
      'A structured review of the projects and technical decisions that shaped my progression toward embedded and systems-oriented work.',
    date: '2026-05-10',
    readTime: '12',
    tags: ['Reflection', 'Growth', 'Systems'],
    image: '/images/journey.png',
  },
]

export const technicalArticles: TechnicalArticle[] = [
  {
    slug: 'vehicle-telemetry-stack',
    title: 'Building a Vehicle Telemetry Stack for NTU Racing Team',
    excerpt:
      'How the CAN decoder, Raspberry Pi monitor, GPS tooling, and remote dashboard fit into a practical vehicle data workflow.',
    date: '2026-05-24',
    readTime: '9',
    tags: ['Telemetry', 'CAN Bus', 'Raspberry Pi', 'NTU Racing'],
    image: '/images/racing.png',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
      { name: 'rpi_can_monitor', url: 'https://github.com/Ktliu-Tyler/rpi_can_monitor' },
      { name: 'nturacing_remote_monitor', url: 'https://github.com/Ktliu-Tyler/nturacing_remote_monitor' },
      { name: 'GPS_tracker', url: 'https://github.com/Ktliu-Tyler/GPS_tracker' },
    ],
    sections: [
      {
        heading: 'Problem Context',
        body: [
          'A formula race car produces several kinds of engineering data: CAN messages from vehicle electronics, GPS data for position and trajectory, and dashboard signals that need to be understood during testing. The main challenge is not only reading these values, but turning them into a workflow that engineers can inspect quickly.',
          'My public repositories show this work evolving from separate utilities into a telemetry stack: CANdecoder for offline decoding, rpi_can_monitor for trackside monitoring, GPS tools for position data, and nturacing_remote_monitor for remote visibility.',
        ],
      },
      {
        heading: 'System Roles',
        bullets: [
          'CANdecoder converts raw CAN traffic into physical signal values using DBC definitions and exports structured CSV data.',
          'rpi_can_monitor runs closer to the vehicle data source and presents real-time status through a Raspberry Pi-based monitoring station.',
          'GPS_tracker and GPS_nturt handle positioning data, NMEA parsing, and trajectory-related workflows.',
          'nturacing_remote_monitor extends the monitoring concept toward a browser-based remote interface.',
        ],
      },
      {
        heading: 'Design Considerations',
        body: [
          'The stack has to support two modes of engineering work. During a test session, the priority is quick visibility: the dashboard should surface abnormal signals, connection state, and vehicle status with minimal friction. After the test session, the priority changes to repeatable analysis: logs should be decoded into a format that can be inspected in spreadsheets, Python scripts, or reporting tools.',
          'That distinction explains why both real-time monitoring and CSV export matter. A dashboard is useful when the car is running; decoded data files are useful when engineers need to compare runs, diagnose behavior, or preserve evidence for later decisions.',
        ],
      },
      {
        heading: 'What This Demonstrates',
        bullets: [
          'Practical CAN bus data handling rather than protocol theory alone.',
          'Python tooling for repeatable data processing and export.',
          'Raspberry Pi integration for trackside engineering workflows.',
          'A systems view that connects sensors, communication protocols, dashboards, and analysis outputs.',
        ],
      },
      {
        heading: 'Next Improvements',
        body: [
          'The most valuable next step would be to document the complete data path with diagrams: CAN source, DBC definitions, decoding logic, real-time display, log storage, and offline analysis. Adding screenshots from the monitor and sample decoded CSV output would make the project easier for recruiters and engineers to evaluate quickly.',
        ],
      },
    ],
  },
  {
    slug: 'dbc-can-decoder',
    title: 'Decoding CAN Data with DBC Files in Python',
    excerpt:
      'A focused look at DBC-based CAN decoding, why raw frames are not enough, and how decoded CSV output supports vehicle analysis.',
    date: '2026-05-24',
    readTime: '8',
    tags: ['CAN Bus', 'DBC', 'Python', 'Data Processing'],
    image: '/images/embedded.png',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
    ],
    sections: [
      {
        heading: 'Why DBC Files Matter',
        body: [
          'Raw CAN frames are compact and efficient for embedded systems, but they are not directly useful for analysis. A frame ID and a sequence of bytes only become meaningful when the engineer knows which signal is stored at which bit position, how it is scaled, and what unit it represents.',
          'A DBC file provides that mapping. It turns a stream of raw bytes into signals such as wheel speed, battery voltage, sensor status, or suspension displacement. Without this layer, every analysis script would need to duplicate signal definitions by hand.',
        ],
      },
      {
        heading: 'Decoder Workflow',
        bullets: [
          'Load the DBC file and build a signal definition map.',
          'Read captured CAN frames from the input data source.',
          'Match each frame ID to a DBC message definition.',
          'Decode byte-level payloads into engineering units.',
          'Export decoded rows to CSV for spreadsheet review or Python analysis.',
        ],
      },
      {
        heading: 'Engineering Tradeoffs',
        body: [
          'The key design tradeoff is between flexibility and repeatability. A quick script can decode one specific signal faster, but a DBC-based decoder scales better as the vehicle network grows. When message IDs or signal definitions change, the DBC can be updated without rewriting the entire analysis pipeline.',
          'CSV export is intentionally simple. It is not the most advanced storage format, but it works well for collaboration because team members can inspect it with common tools. For a university racing team, that practical interoperability is often more important than introducing a heavier data platform too early.',
        ],
      },
      {
        heading: 'What I Would Document Next',
        bullets: [
          'A sample raw CAN frame and its decoded output.',
          'A minimal DBC example with bit positions, scale, offset, and units.',
          'A comparison between manual decoding and DBC-based decoding.',
          'Error-handling behavior for unknown IDs or malformed frames.',
        ],
      },
    ],
  },
  {
    slug: 'gps-data-acquisition',
    title: 'GPS Tracking and Data Acquisition for Race Vehicle Testing',
    excerpt:
      'How GPS receiver data, NMEA parsing, and trajectory recording support vehicle testing workflows.',
    date: '2026-05-24',
    readTime: '7',
    tags: ['GPS', 'NMEA', 'Data Acquisition', 'Python'],
    image: '/images/embedded.png',
    sourceRepos: [
      { name: 'GPS_tracker', url: 'https://github.com/Ktliu-Tyler/GPS_tracker' },
      { name: 'GPS_nturt', url: 'https://github.com/Ktliu-Tyler/GPS_nturt' },
    ],
    sections: [
      {
        heading: 'Why GPS Data Is Useful',
        body: [
          'Vehicle testing is easier to interpret when sensor data can be connected to position and movement. GPS data provides a time-based record of location, speed, and trajectory, which makes it possible to compare vehicle behavior across test runs.',
          'The GPS_tracker and GPS_nturt repositories represent this part of the telemetry workflow: receiving GPS data, parsing NMEA sentences, and preparing location data for recording or visualization.',
        ],
      },
      {
        heading: 'NMEA as an Interface',
        body: [
          'Many GPS modules output NMEA sentences over serial communication. These sentences are text-based, which makes them relatively easy to inspect, but a useful tool still needs to parse message types, validate fields, extract coordinates, and handle incomplete or noisy data.',
        ],
      },
      {
        heading: 'Core Implementation Concerns',
        bullets: [
          'Serial connection stability and reconnect behavior.',
          'Parsing multiple NMEA sentence types without assuming every line is valid.',
          'Converting latitude and longitude formats into data structures that are easier to analyze.',
          'Recording time-aligned data so vehicle behavior can be reviewed after a run.',
        ],
      },
      {
        heading: 'How It Fits the Larger Stack',
        body: [
          'GPS data becomes more valuable when it is paired with CAN data. CAN signals describe what the vehicle is doing internally, while GPS describes where the vehicle is and how it moves. Together, they support better diagnostics than either data source alone.',
        ],
      },
      {
        heading: 'Next Improvements',
        body: [
          'The project would benefit from a documented sample dataset, a small map-based visualization, and a clear explanation of how timestamps are aligned with CAN logs. Those additions would make the project read like an engineering data-acquisition case study rather than only a parser utility.',
        ],
      },
    ],
  },
  {
    slug: 'hardware-communication-protocols',
    title: 'From RS485 Modbus to CAN Bus: Working with Hardware Communication Protocols',
    excerpt:
      'A comparison of two practical hardware communication workflows: motor control over RS485 Modbus and vehicle telemetry over CAN.',
    date: '2026-05-24',
    readTime: '8',
    tags: ['RS485', 'Modbus', 'CAN Bus', 'Motor Control'],
    image: '/images/embedded.png',
    sourceRepos: [
      { name: 'Simplexmotion-pymodbusRS485', url: 'https://github.com/Ktliu-Tyler/Simplexmotion-pymodbusRS485' },
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
    ],
    sections: [
      {
        heading: 'Two Protocols, Different Engineering Shapes',
        body: [
          'RS485 Modbus and CAN bus both appear in hardware-adjacent software, but they encourage different mental models. Modbus is often request-response oriented and maps naturally to registers, commands, and device addresses. CAN is broadcast-oriented and maps naturally to message IDs, signal definitions, and network-wide communication.',
          'Working with both is useful because it develops the same core skill from two directions: writing software that respects hardware interfaces, timing, data formats, and failure modes.',
        ],
      },
      {
        heading: 'SimplexMotion RS485 Work',
        body: [
          'The Simplexmotion-pymodbusRS485 repository focuses on testing Simplex Motion motors through an RS485 interface using Python and Modbus RTU. The README already documents practical assumptions such as COM port, slave address, wiring, and a staged testing plan from position control toward other modes.',
        ],
      },
      {
        heading: 'CAN Bus Work',
        body: [
          'The CANdecoder repository focuses on the opposite side of hardware communication: decoding broadcast messages into usable engineering data. Instead of writing command registers to one device, the tool interprets frames from a vehicle network using DBC definitions.',
        ],
      },
      {
        heading: 'Shared Lessons',
        bullets: [
          'Communication software is only reliable when wiring, addressing, baud rate, and data format assumptions are explicit.',
          'Small test scripts are valuable when bringing up hardware for the first time.',
          'Readable logs and exported data make debugging faster than relying only on live terminal output.',
          'Protocol-specific knowledge matters, but the broader habit is systematic interface verification.',
        ],
      },
      {
        heading: 'Professional Framing',
        body: [
          'Together, these projects show a practical hardware-software integration path: first controlling a device through an industrial protocol, then decoding vehicle network data through an automotive protocol. That progression is more valuable to present than either repository alone.',
        ],
      },
    ],
  },
  {
    slug: 'iot-control-system',
    title: 'Building an IoT Control System with ESP32, IR, and MQTT',
    excerpt:
      'A practical smart-home control architecture combining embedded firmware, infrared control, MQTT communication, and a web interface.',
    date: '2026-05-24',
    readTime: '7',
    tags: ['IoT', 'ESP32', 'MQTT', 'Embedded'],
    image: '/images/iot.png',
    sourceRepos: [
      { name: 'IRremote_ESP32886_IOT', url: 'https://github.com/Ktliu-Tyler/IRremote_ESP32886_IOT' },
      { name: 'IOT_controller', url: 'https://github.com/Ktliu-Tyler/IOT_controller' },
    ],
    sections: [
      {
        heading: 'System Goal',
        body: [
          'The IoT control work connects embedded devices with a user-facing control interface. The IR remote project focuses on infrared appliance control with ESP32 or ESP8266 hardware, while IOT_controller expands the idea into a broader smart-home control hub with MQTT communication and a web interface.',
        ],
      },
      {
        heading: 'Architecture',
        bullets: [
          'Embedded device: sends infrared commands and handles network communication.',
          'Communication layer: uses MQTT-style messaging to decouple devices from the control interface.',
          'Web interface: provides a more accessible way to trigger actions and inspect system state.',
          'Automation layer: groups device actions into repeatable control flows.',
        ],
      },
      {
        heading: 'Engineering Challenges',
        body: [
          'IoT projects are often less about a single algorithm and more about integration. The firmware has to communicate reliably, the UI has to expose the right controls, and the system has to remain understandable when devices fail, disconnect, or receive unexpected commands.',
          'The repository records show an important professional direction: combining embedded C/C++ with browser-based interfaces and network messaging rather than treating firmware and frontend work as separate worlds.',
        ],
      },
      {
        heading: 'What Would Improve the Portfolio Presentation',
        bullets: [
          'Add a system architecture diagram that shows device, broker, frontend, and IR output.',
          'Document the MQTT topics and message payload structure.',
          'Include a short demo flow such as turning on a device, switching modes, and confirming state.',
          'Add photos or screenshots of the physical build and the control UI.',
        ],
      },
    ],
  },
  {
    slug: 'stock-analysis-dashboard',
    title: 'Designing a Local Stock Analysis Dashboard with Python and AI-Assisted Reports',
    excerpt:
      'A local web dashboard for Taiwan stock analysis using Python, SQLite, technical indicators, risk scoring, and local model-assisted summaries.',
    date: '2026-05-24',
    readTime: '8',
    tags: ['Python', 'SQLite', 'Dashboard', 'Data Analysis'],
    image: '/images/data.png',
    sourceRepos: [
      { name: 'Stock-Analysis-Taiwan', url: 'https://github.com/Ktliu-Tyler/Stock-Analysis-Taiwan' },
    ],
    sections: [
      {
        heading: 'Project Scope',
        body: [
          'Stock-Analysis-Taiwan is a local web dashboard for Taiwan stock research. The README describes a system that combines technical indicators, chip/market data, sentiment-related inputs, risk scoring, local rules, portfolio records, and local Ollama-assisted analysis.',
          'The project is positioned as research support rather than financial advice. That distinction is important: the engineering goal is to organize data and analysis workflows, not to automate trading decisions.',
        ],
      },
      {
        heading: 'System Components',
        bullets: [
          'Python standard-library backend and static file serving.',
          'SQLite storage for scan data, prices, scoring, news, and portfolio records.',
          'Frontend views for filters, individual stock pages, AI-style reports, and holdings workflows.',
          'Multiple analysis modes for short-term, swing, and longer-horizon observation.',
        ],
      },
      {
        heading: 'Recent Development Direction',
        body: [
          'The commit history shows rapid iteration around local scoring modes, mobile layout, Bollinger and KDJ analysis, cached updates, and local model streaming controls. That suggests the project is moving from a script-based tool toward a full local analysis product.',
        ],
      },
      {
        heading: 'Engineering Value',
        body: [
          'This project is useful for a portfolio because it demonstrates a different side of software engineering from embedded systems: data modeling, persistence, dashboard UX, workflow design, and local AI integration. It also shows the ability to build a practical tool around a real personal research process.',
        ],
      },
      {
        heading: 'Next Improvements',
        bullets: [
          'Document the data schema and update pipeline.',
          'Add screenshots of the dashboard states and report layout.',
          'Separate investment disclaimers from engineering documentation.',
          'Add a small sample dataset or anonymized walkthrough so readers can understand the workflow without running the full system.',
        ],
      },
    ],
  },
]

export const articleSummaries: ArticleSummary[] = [
  ...technicalArticles,
  ...existingArticleSummaries,
]

export function getTechnicalArticle(slug: string) {
  return technicalArticles.find((article) => article.slug === slug)
}

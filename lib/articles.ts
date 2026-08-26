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
  imagePosition?: string
  category?: string
  sourceType?: string
  sourceRepos?: Array<{
    name: string
    url: string
  }>
}

export interface TechnicalArticle extends ArticleSummary {
  sections: ArticleSection[]
}

export const technicalArticles: TechnicalArticle[] = [
  {
    slug: 'vehicle-telemetry-stack',
    title: 'Building a Vehicle Telemetry Stack for NTU Racing Team',
    excerpt:
      'A practical view of how CAN decoding, GPS acquisition, Raspberry Pi monitoring, and remote dashboards can work together during vehicle testing.',
    date: '2026-05-24',
    readTime: '9',
    tags: ['Telemetry', 'CAN Bus', 'Raspberry Pi', 'NTU Racing'],
    image: '/images/experience/ntu-racing-sunset-car.jpg',
    imagePosition: '64% 82%',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
      { name: 'rpi_can_monitor', url: 'https://github.com/Ktliu-Tyler/rpi_can_monitor' },
      { name: 'nturacing_remote_monitor', url: 'https://github.com/Ktliu-Tyler/nturacing_remote_monitor' },
      { name: 'GPS_tracker', url: 'https://github.com/Ktliu-Tyler/GPS_tracker' },
    ],
    sections: [
      {
        heading: 'Engineering Context',
        body: [
          'A race car produces data from many sources: CAN messages from electronic control units, GPS position data, and dashboard signals that need to be interpreted during testing. The difficult part is not only collecting those values. The real challenge is turning them into a workflow that engineers can trust under time pressure.',
          'The related repositories show this workflow developing in layers. CANdecoder handles offline decoding, rpi_can_monitor supports trackside visibility, GPS tools provide position and trajectory data, and nturacing_remote_monitor extends the same information toward a browser-based interface.',
        ],
      },
      {
        heading: 'System Responsibilities',
        bullets: [
          'CANdecoder converts raw CAN frames into physical signal values using DBC definitions and exports structured CSV data.',
          'rpi_can_monitor runs closer to the vehicle data source and provides a real-time monitoring station for trackside inspection.',
          'GPS_tracker and GPS_nturt parse receiver output and prepare location data for recording and later analysis.',
          'nturacing_remote_monitor explores remote visibility so test data can be inspected through a more accessible interface.',
        ],
      },
      {
        heading: 'Real-Time Versus Post-Run Analysis',
        body: [
          'Vehicle testing has two distinct modes. During a run, the priority is fast awareness: engineers need to see connection state, abnormal signals, and key vehicle values without digging through logs. After a run, the priority becomes repeatability: data should be decoded into files that can be compared and analyzed later.',
          'That distinction explains why both dashboards and CSV exports matter. A dashboard helps during operation; decoded data files help when the team needs to compare runs, diagnose a failure, or preserve useful context for future design decisions.',
        ],
      },
      {
        heading: 'Portfolio Value',
        body: [
          'This stack is valuable because it connects embedded communication, data processing, hardware integration, and interface design. It shows more than a single tool; it shows an engineering workflow from vehicle signals to human-readable decisions.',
        ],
        bullets: [
          'Practical CAN bus data handling rather than protocol theory alone.',
          'Python tooling for repeatable decoding and export.',
          'Raspberry Pi integration for trackside workflows.',
          'A systems view that connects sensors, protocols, dashboards, and analysis outputs.',
        ],
      },
      {
        heading: 'Next Improvements',
        body: [
          'The strongest next step would be to document the full data path with diagrams and screenshots: CAN source, DBC definitions, decoding logic, real-time display, log storage, and offline analysis. A sample decoded CSV file would also make the project easier to evaluate quickly.',
        ],
      },
    ],
  },
  {
    slug: 'dbc-can-decoder',
    title: 'Decoding CAN Data with DBC Files in Python',
    excerpt:
      'Why raw CAN frames are not enough for engineering analysis, and how DBC-based decoding turns byte payloads into readable vehicle signals.',
    date: '2026-05-24',
    readTime: '8',
    tags: ['CAN Bus', 'DBC', 'Python', 'Data Processing'],
    image: '/images/embedded.png',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
    ],
    sections: [
      {
        heading: 'Why Raw Frames Are Not Enough',
        body: [
          'A raw CAN frame is compact and efficient, but it is not directly useful for analysis. A message ID and a sequence of bytes only become meaningful when the engineer knows which signal is stored at which bit position, how it is scaled, and what unit it represents.',
          'A DBC file provides that missing map. It defines messages, signals, bit positions, scaling factors, offsets, and units. With that layer in place, the same raw payload can be translated into values such as wheel speed, battery voltage, sensor status, or suspension displacement.',
        ],
      },
      {
        heading: 'Decoder Workflow',
        bullets: [
          'Load the DBC file and build a signal definition map.',
          'Read captured CAN frames from the selected input source.',
          'Match each frame ID to a DBC message definition.',
          'Decode byte-level payloads into engineering units.',
          'Export decoded rows to CSV for spreadsheet review or Python analysis.',
        ],
      },
      {
        heading: 'Design Tradeoffs',
        body: [
          'The key tradeoff is flexibility versus repeatability. A quick one-off script can decode a single signal quickly, but it does not scale when the vehicle network grows. A DBC-based decoder keeps signal definitions outside the processing code, so changes to message layout can be handled by updating the DBC file instead of rewriting the pipeline.',
          'CSV output is intentionally simple. It is not the most advanced storage format, but it is easy to inspect, easy to share, and compatible with common analysis tools. For a student racing team, that interoperability often matters more than introducing a heavier data platform too early.',
        ],
      },
      {
        heading: 'What I Would Document Next',
        bullets: [
          'A sample raw CAN frame next to its decoded output.',
          'A minimal DBC example showing bit position, scale, offset, and units.',
          'Expected behavior for unknown IDs and malformed frames.',
          'A short walkthrough from input log to final CSV export.',
        ],
      },
    ],
  },
  {
    slug: 'gps-data-acquisition',
    title: 'GPS Tracking and Data Acquisition for Race Vehicle Testing',
    excerpt:
      'How receiver data, NMEA parsing, and trajectory recording can support a more complete vehicle testing workflow.',
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
        heading: 'Why GPS Data Matters',
        body: [
          'Vehicle testing is easier to understand when sensor data can be connected to position and movement. GPS data provides a time-based record of location, speed, and trajectory, which helps compare behavior across test runs.',
          'The GPS_tracker and GPS_nturt repositories cover this part of the telemetry workflow: receiving GPS output, parsing NMEA sentences, and preparing location data for recording or visualization.',
        ],
      },
      {
        heading: 'NMEA as an Interface',
        body: [
          'Many GPS modules output NMEA sentences over serial communication. The format is text-based, which makes it relatively easy to inspect, but a reliable tool still has to parse message types, validate fields, extract coordinates, and handle incomplete or noisy data.',
        ],
      },
      {
        heading: 'Implementation Concerns',
        bullets: [
          'Maintain a stable serial connection and define reconnect behavior.',
          'Parse multiple NMEA sentence types without assuming every line is valid.',
          'Convert latitude and longitude formats into data structures that are easier to analyze.',
          'Record time-aligned data so vehicle behavior can be reviewed after a run.',
        ],
      },
      {
        heading: 'How It Fits the Larger Stack',
        body: [
          'GPS data becomes more useful when paired with CAN data. CAN signals describe what the vehicle is doing internally, while GPS describes where the vehicle is and how it moves. Together, they support better diagnostics than either data source can provide alone.',
        ],
      },
      {
        heading: 'Next Improvements',
        body: [
          'The project would read more clearly with a sample dataset, a simple map-based visualization, and a documented timestamp alignment strategy between GPS records and CAN logs.',
        ],
      },
    ],
  },
  {
    slug: 'hardware-communication-protocols',
    title: 'From RS485 Modbus to CAN Bus: Working with Hardware Communication Protocols',
    excerpt:
      'A comparison of two hardware-facing workflows: motor control through RS485 Modbus and vehicle telemetry through CAN.',
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
        heading: 'Two Protocols, Two Mental Models',
        body: [
          'RS485 Modbus and CAN bus both appear in hardware-adjacent software, but they encourage different design habits. Modbus is often request-response oriented and maps naturally to registers, commands, and device addresses. CAN is broadcast-oriented and maps naturally to message IDs, signal definitions, and network-wide communication.',
          'Working with both protocols develops the same core discipline from two directions: writing software that respects wiring, timing, addressing, data formats, and failure modes.',
        ],
      },
      {
        heading: 'Motor Control over RS485 Modbus',
        body: [
          'The Simplexmotion-pymodbusRS485 repository focuses on testing Simplex Motion motors through an RS485 interface using Python and Modbus RTU. The practical concerns are concrete: COM port selection, slave address, wiring, register definitions, and staged testing from position control toward additional modes.',
        ],
      },
      {
        heading: 'Vehicle Data over CAN',
        body: [
          'The CANdecoder repository focuses on the opposite side of hardware communication. Instead of writing command registers to one device, it interprets broadcast messages from a vehicle network and converts them into usable engineering data through DBC definitions.',
        ],
      },
      {
        heading: 'Shared Lessons',
        bullets: [
          'Communication software is only reliable when wiring, baud rate, addressing, and data format assumptions are explicit.',
          'Small test scripts are useful when bringing up hardware for the first time.',
          'Readable logs and exported data make debugging faster than relying only on live terminal output.',
          'Protocol-specific knowledge matters, but the broader habit is systematic interface verification.',
        ],
      },
      {
        heading: 'Professional Framing',
        body: [
          'Together, these projects show a practical hardware-software integration path: first controlling a device through an industrial protocol, then decoding vehicle network data through an automotive protocol. That progression is stronger than presenting either repository alone.',
        ],
      },
    ],
  },
  {
    slug: 'iot-control-system',
    title: 'Building an IoT Control System with ESP32, IR, and MQTT',
    excerpt:
      'A smart-home control architecture that connects embedded firmware, infrared commands, network messaging, and a web interface.',
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
          'The IoT control work connects embedded devices with a user-facing control interface. The infrared remote project focuses on appliance control with ESP32 or ESP8266 hardware, while IOT_controller expands the idea into a broader smart-home hub with network messaging and a web interface.',
        ],
      },
      {
        heading: 'Architecture',
        bullets: [
          'Embedded device: sends infrared commands and manages network communication.',
          'Communication layer: decouples device actions from the control interface through message-based design.',
          'Web interface: provides a more accessible way to trigger actions and inspect system state.',
          'Automation layer: groups device actions into repeatable control flows.',
        ],
      },
      {
        heading: 'Engineering Challenges',
        body: [
          'IoT projects are less about a single algorithm and more about integration. Firmware must communicate reliably, the interface must expose the right controls, and the whole system must remain understandable when devices disconnect or receive unexpected commands.',
          'These repositories show a useful direction: combining embedded C/C++ with browser-based interfaces and network messaging instead of treating firmware and frontend work as separate worlds.',
        ],
      },
      {
        heading: 'Presentation Improvements',
        bullets: [
          'Add a system diagram showing device, broker, frontend, and IR output.',
          'Document message topics and payload structure.',
          'Include a short demo flow such as triggering a device and confirming state.',
          'Add photos or screenshots of the physical build and the control UI.',
        ],
      },
    ],
  },
  {
    slug: 'stock-analysis-dashboard',
    title: 'Designing a Local Stock Analysis Dashboard with Python and AI-Assisted Reports',
    excerpt:
      'A local dashboard for Taiwan stock research that combines data persistence, indicators, scoring, and model-assisted summaries.',
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
          'Stock-Analysis-Taiwan is a local dashboard for Taiwan stock research. The repository describes a system that combines technical indicators, market data, scoring, portfolio records, and local model-assisted analysis.',
          'The project should be understood as research support rather than financial advice. The engineering goal is to organize data and analysis workflows, not to automate trading decisions.',
        ],
      },
      {
        heading: 'System Components',
        bullets: [
          'Python backend and local static file serving.',
          'SQLite storage for scan data, prices, scoring, news, and portfolio records.',
          'Frontend views for filters, individual stock pages, reports, and holdings workflows.',
          'Multiple analysis modes for short-term, swing, and longer-horizon observation.',
        ],
      },
      {
        heading: 'Development Direction',
        body: [
          'The commit history suggests rapid iteration around scoring modes, mobile layout, technical indicators, cached updates, and local model streaming controls. That direction moves the project from a script-based utility toward a complete local analysis product.',
        ],
      },
      {
        heading: 'Engineering Value',
        body: [
          'This project adds a different dimension to the portfolio. It demonstrates data modeling, persistence, dashboard UX, workflow design, and local AI integration. It also shows the ability to build a practical tool around a real research process.',
        ],
      },
      {
        heading: 'Next Improvements',
        bullets: [
          'Document the data schema and update pipeline.',
          'Add screenshots of dashboard states and report layout.',
          'Separate investment disclaimers from engineering documentation.',
          'Provide a small sample dataset or anonymized walkthrough.',
        ],
      },
    ],
  },
  {
    slug: 'racing-team',
    title: 'Building Embedded Software in NTU Racing Team',
    excerpt:
      'A technical reflection on vehicle electronics, embedded software responsibilities, and the transition from mechanical engineering to systems development.',
    date: '2026-05-20',
    readTime: '8',
    tags: ['NTU Racing', 'Embedded', 'CAN Bus'],
    image: '/images/experience/ntu-racing-driver-car.jpg',
    imagePosition: '50% 62%',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
      { name: 'rpi_can_monitor', url: 'https://github.com/Ktliu-Tyler/rpi_can_monitor' },
      { name: 'GPS_nturt', url: 'https://github.com/Ktliu-Tyler/GPS_nturt' },
    ],
    sections: [
      {
        heading: 'Joining the Team',
        body: [
          'Studying mechanical engineering gave me a strong systems foundation, but NTU Racing Team made the connection between software and physical behavior much more direct. Vehicle electronics require decisions that can be tested immediately: a sensor either reports reliably, a bus message either decodes correctly, and a monitoring tool either helps the team diagnose the car or it does not.',
          'That environment pushed my work from general programming toward embedded systems, vehicle communication, and engineering tools that support real testing.',
        ],
      },
      {
        heading: 'Electrical Division Responsibilities',
        body: [
          'The electrical system sits between hardware, software, and the rest of the vehicle. A useful tool in this area has to respect wiring constraints, real-time behavior, data formats, and the needs of other team members who may not work directly with the code.',
        ],
        bullets: [
          'CAN communication tooling for decoding and debugging vehicle messages.',
          'GPS data handling for position and trajectory-related workflows.',
          'Trackside monitoring through Raspberry Pi-based interfaces.',
          'Documentation and integration work that helps other divisions interpret electronic data.',
        ],
      },
      {
        heading: 'Technical Lessons',
        body: [
          'The most important lesson was that embedded software is not isolated from the rest of the system. Every assumption in code eventually touches wiring, sensors, timing, power, or mechanical behavior. That makes debugging slower, but it also makes the feedback more meaningful.',
          'It also changed how I think about tools. A good engineering tool does not only run successfully; it reduces uncertainty for the people using it. In a testing environment, clear logs, readable values, and predictable failure behavior matter as much as the core algorithm.',
        ],
      },
      {
        heading: 'What This Added to My Portfolio',
        body: [
          'This experience is the clearest bridge between my mechanical engineering background and my software direction. It shows that I can work across hardware constraints, embedded communication, data processing, and interface design while staying focused on practical engineering outcomes.',
        ],
      },
    ],
  },
  {
    slug: 'can-protocol',
    title: 'CAN Bus Fundamentals for Vehicle Telemetry',
    excerpt:
      'An engineering-oriented overview of CAN communication, DBC decoding, and how vehicle teams can turn bus traffic into useful telemetry.',
    date: '2026-05-15',
    readTime: '10',
    tags: ['CAN Bus', 'Automotive', 'Python'],
    image: '/images/embedded.png',
    sourceRepos: [
      { name: 'CANdecoder', url: 'https://github.com/Ktliu-Tyler/CANdecoder' },
      { name: 'rpi_can_monitor', url: 'https://github.com/Ktliu-Tyler/rpi_can_monitor' },
    ],
    sections: [
      {
        heading: 'What CAN Solves',
        body: [
          'CAN, or Controller Area Network, is a communication protocol designed for environments where multiple electronic devices must exchange data reliably. In vehicles, it reduces wiring complexity by allowing many control units to share the same bus instead of requiring dedicated wiring for every signal.',
          'For telemetry work, CAN is useful because it provides a structured way to move vehicle state across the system. Sensors and controllers can broadcast compact messages, while monitoring tools can listen, decode, and present the information in a readable form.',
        ],
      },
      {
        heading: 'Important Protocol Features',
        bullets: [
          'Differential signaling improves noise immunity in electrically harsh environments.',
          'Message IDs define priority and allow receivers to filter relevant traffic.',
          'Broadcast communication lets multiple devices observe the same signal without direct point-to-point wiring.',
          'Built-in error detection helps make communication robust enough for vehicle use.',
        ],
      },
      {
        heading: 'From Frames to Signals',
        body: [
          'A CAN frame by itself is still only a payload. Engineers need to know how each byte maps to a physical signal. This is where DBC definitions become important: they describe message names, signal positions, lengths, scaling factors, offsets, and units.',
          'Once the mapping exists, a decoder can translate raw values into engineering data such as speed, voltage, temperature, or displacement. That translation is the foundation for both real-time dashboards and post-run analysis.',
        ],
      },
      {
        heading: 'Practical Tooling',
        body: [
          'CANdecoder focuses on offline analysis. It reads recorded data, applies DBC definitions, and exports decoded values for later inspection. rpi_can_monitor focuses on real-time visibility by receiving CAN traffic near the vehicle and presenting key values during testing.',
          'Together, these tools cover the two most common needs in vehicle telemetry: immediate awareness during a run and repeatable analysis afterward.',
        ],
      },
      {
        heading: 'Takeaway',
        body: [
          'CAN is not only a protocol topic. In a real project, it becomes part of a broader engineering system that includes hardware interfaces, decoding rules, data storage, dashboards, and team communication. Good tooling makes that system easier to reason about.',
        ],
      },
    ],
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
    sourceRepos: [
      { name: 'portfolio', url: 'https://github.com/Ktliu-Tyler/portfolio' },
      { name: 'Stock-Analysis-Taiwan', url: 'https://github.com/Ktliu-Tyler/Stock-Analysis-Taiwan' },
      { name: 'IOT_controller', url: 'https://github.com/Ktliu-Tyler/IOT_controller' },
    ],
    sections: [
      {
        heading: 'Starting Point',
        body: [
          'I began programming while studying mechanical engineering. The earliest projects were small, but they made one thing clear: software gave me a fast feedback loop for testing ideas, analyzing behavior, and connecting abstract logic to visible results.',
          'That feedback loop gradually moved my work from simple experiments toward tools that interact with data, hardware, and engineering workflows.',
        ],
      },
      {
        heading: 'Exploration Phase',
        body: [
          'The first stage was intentionally broad. I built small applications, game projects, image-processing experiments, audio classification work, and desktop utilities. These projects helped me learn programming fundamentals from different angles: event loops, file handling, user interfaces, data processing, and basic system structure.',
          'Not every project was polished, but each one made later work easier. The important outcome was not a perfect early repository; it was the ability to break a technical problem into parts and keep improving through iteration.',
        ],
      },
      {
        heading: 'Shift Toward Hardware and Systems',
        body: [
          'The next stage moved closer to hardware-facing software. Motor control over RS485 Modbus, CAN decoding, GPS parsing, and Raspberry Pi monitoring all required a different mindset from ordinary application development. The software had to respect protocols, timing, wiring, and imperfect real-world data.',
          'This is where my mechanical engineering background became useful. Understanding the physical system helped me write software with better assumptions and clearer debugging priorities.',
        ],
      },
      {
        heading: 'Current Direction',
        bullets: [
          'Embedded systems and hardware-software integration.',
          'Vehicle telemetry and engineering data workflows.',
          'IoT control systems that connect firmware, messaging, and interfaces.',
          'Data tools and dashboards that turn raw records into readable decisions.',
        ],
      },
      {
        heading: 'What I Want This Portfolio to Show',
        body: [
          'The goal of this portfolio is not to present a random list of repositories. It is to show a progression: from learning programming fundamentals, to building practical tools, to connecting software with physical systems. The strongest projects are the ones where software makes engineering behavior easier to observe, measure, or control.',
        ],
      },
    ],
  },
]

export const articleSummaries: ArticleSummary[] = technicalArticles

export function getTechnicalArticle(slug: string) {
  return technicalArticles.find((article) => article.slug === slug)
}

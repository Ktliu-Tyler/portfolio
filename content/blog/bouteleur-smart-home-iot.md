---
title: "BOUTELEUR: From IR Remote Trouble to a Local Smart-Home Console"
excerpt: "A record of a smart-home course project built with Node.js, MQTT, ESP8266, IR signals, sensors, and gesture-control experiments."
date: "2026-07-23"
readTime: "6"
tags: ["IoT", "MQTT", "ESP8266", "IR Remote"]
coverImage: "/images/experience/bouteleur-ui.jpg"
category: "course-project"
sourceType: "course-report"
sources:
  - type: "report"
    name: "Analog Electronics Practice final report"
---

## Starting Point

BOUTELEUR began from a daily-life problem: remote controls disappear, appliances are hard to manage from one place, and home devices often do not share the same interface.

The project goal was to build a low-cost smart-home console that could learn and send infrared commands, monitor temperature and humidity, and expose controls through a local web interface.

## Iteration

The first idea used Blynk, but the device limits and data-transfer model made it hard to scale. The later version moved toward a local Node.js page and MQTT communication. Devices could subscribe and publish messages through channels, making the system easier to extend and debug.

The IR module also evolved. ESP8266 became the transmitter and receiver core, handling IR signal capture and playback. The interface added device lists, editable labels, signal sending, and environment monitoring.

## Why It Matters

This project is early compared with my later racing and haptic work, but it is important because it trained product-style thinking. I had to consider user interaction, hardware cost, signal reliability, protocol design, and iteration under course constraints.

![BOUTELEUR web interface](/images/experience/bouteleur-ui.jpg)


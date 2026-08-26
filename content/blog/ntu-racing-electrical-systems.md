---
title: "What NTU Racing Taught Me About Embedded Vehicle Systems"
excerpt: "A reflection on VCU development, telemetry, CAN data, RTK GPS, Raspberry Pi monitoring, and electrical-team leadership."
date: "2026-07-23"
readTime: "8"
tags: ["NTU Racing", "Embedded", "CAN Bus", "Telemetry"]
coverImage: "/images/experience/ntu-racing-driver-car.jpg"
imagePosition: "50% 62%"
category: "engineering"
sourceType: "team-record"
sources:
  - type: "experience"
    name: "NTU Racing records and photos"
---

## Why The Team Mattered

NTU Racing changed how I think about software. In a vehicle, code does not live in a clean abstract space. It touches wiring, sensors, power distribution, timing, communication protocols, test procedures, and the behavior of a physical car.

That environment made embedded systems feel real. A decoded signal either helps the team diagnose a run, or it does not. A dashboard either reduces uncertainty during testing, or it becomes noise.

## Electrical Responsibilities

My work grew across several areas:

- Vehicle-control development around STM32 and Zephyr RTOS.
- VCU HAT PCB and low-voltage integration work.
- CAN decoding and data tooling for vehicle diagnostics.
- Raspberry Pi-based monitoring and remote dashboard workflows.
- RTK GPS integration for positioning, trajectory recording, and vehicle analysis.
- Team leadership, technical workshops, and cross-division communication.

## Telemetry As A Workflow

A telemetry stack is more than a screen. It starts from sensor and controller data, passes through CAN or ROS2 topics, reaches a local or remote monitoring interface, and then becomes reference material for engineering decisions.

That full path is why I present NTU Racing as one of my strongest experiences. It combines embedded communication, hardware integration, data processing, interface design, and team operation under real testing pressure.

![NTU Racing race car at sunset](/images/experience/ntu-racing-sunset-car.jpg)

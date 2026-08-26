---
title: "Building a Haptic-Feedback Surgical Simulation Workflow"
excerpt: "How haptic devices, OpenGL rendering, collision handling, and force feedback shaped my research direction."
date: "2026-07-23"
readTime: "7"
tags: ["Haptics", "OpenGL", "Research", "Human-Machine Interaction"]
coverImage: "/images/experience/haptic-surgery-simulation.jpg"
category: "research"
sourceType: "research-notes"
sources:
  - type: "experience"
    name: "ICROSS Lab haptic research"
---

## Research Context

The haptic surgical simulation project asks a very concrete question: can a virtual surgical task give the operator useful tactile feedback? The answer depends on more than graphics. It depends on collision detection, force calculation, update frequency, synchronization, and whether the interaction feels stable.

I worked with haptic operation devices and OpenGL to build a virtual environment for a surgical task. The system uses 3D models for instruments and tissue-like geometry, then calculates feedback based on contact position and surface direction.

## What Made It Difficult

Force feedback is sensitive. If collision rules or force parameters are rough, the device may vibrate, penetrate the model, or feel unnatural. That makes the project different from ordinary visualization. A visual bug can be tolerated for a moment; an unstable force response is immediately felt by the user.

The work trained me to evaluate a system through several lenses at once:

- Does collision detection correctly recognize contact?
- Is the feedback force continuous enough to feel stable?
- Can the graphics loop and haptic loop stay synchronized?
- Does the workspace match the real hand motion required by the task?

## Mechanism Design Direction

The parallel haptic mechanism work added another layer. Instead of only writing simulation software, I also had to think about workspace reduction, linkage layout, degrees of freedom, friction, and inertia. These mechanical properties directly affect what the controller can do later.

That is why this research became one of the central records in my portfolio: it connects software, mechanics, control, and human-machine interaction in one system.

![Six-degree-of-freedom haptic mechanism design](/images/experience/haptic-6dof-design.png)


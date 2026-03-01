# 🚀 Intergalactic Portfolio

**A Cinematic 3D Space Dashboard & Navigation Interface**

## 🌌 Overview

**Intergalactic Portfolio** is a high-fidelity, interactive web experience designed to simulate a spacecraft's command center. It features a real-time 3D viewport of orbiting celestial bodies, an integrated radar navigation system, and deep-space data extraction capabilities.

The project showcases advanced front-end techniques, specifically focusing on **WebGL rendering**, **asynchronous UI transitions**, and **cross-window communication**.

---

## 🛠️ Tech Stack

* **Engine:** [Three.js](https://threejs.org/) (WebGL)
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
* **Styling:** Custom Sci-Fi UI/UX Design with Glassmorphism
* **Deployment:** GitHub Pages

---

## 🛰️ Key Features

### 1. Dynamic 3D Viewport

* **Seamless Transitions:** Custom `switchPlanet` logic that handles "Exit" and "Enter" animations using cubic easing.
* **Time Machine:** Real-time rotation speed manipulation (0.5x to 4x) via global time multipliers.
* **Orbit Mode:** Interactive scaling and focus shifts to simulate approaching a planet for scan.

### 2. Interactive Radar Map (`Choice B` Architecture)

* **Iframe Synchronization:** Utilizes the `postMessage` API to facilitate bidirectional communication between the main dashboard and the navigation sub-module.
* **Zig-Zag Pathing:** An SVG-powered dynamic flight path that connects planetary nodes.
* **Active Tracking:** Real-time visual feedback on the map when the 3D scene changes.

### 3. Data Extraction System

* **Tactile Feedback:** Multi-stage button states (hover/active) for a physical dashboard feel.
* **Analysis Popup:** A translucent blue HUD overlay that pulls planet-specific metadata from a structured JavaScript dictionary.

---

## 📂 Project Structure

```bash
├── index.html          # Main Command Center UI
├── map.html            # Radar Navigation Sub-module (Iframe)
├── planet.js           # Three.js Scene, Geometry, & Transition Logic
├── script.js           # Dashboard UI Logic & Iframe Communication
├── style.css           # Global Sci-Fi Styles & Glassmorphism
├── map.css             # Map-specific Grid and SVG Styles
└── assets/             # 2K/4K High-Res Planet Textures

```

---

## 🚀 Live Deployment

Explore the universe here:

👉 **[https://armouredore.github.io/Intergalactic-Portfolio/](https://armouredore.github.io/Intergalactic-Portfolio/)**

---

## 🛠️ Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/armouredore/Intergalactic-Portfolio.git

```


2. Open `index.html` in any modern browser (Chrome/Brave recommended for WebGL performance).
3. *Note: For texture loading, it is recommended to run this via a local server (e.g., Live Server extension in VS Code).*

---

**Developed with 💙 by [Swaraj Mandar Rane]** *“Exploring the stars, one line of code at a time.”*

---

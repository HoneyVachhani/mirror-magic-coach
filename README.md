# Mirror Magic Coach™ AI Agent Web Application

A premium, serverless, client-side web application acting as the digital presence of **Honey Vachhani — Mirror Magic Coach™**. 

This interface allows clients to consult with Honey's AI Agent while practicing mirror work in a split-screen viewport via webcam.

## Features
- **Interactive Camera Mirror**: Flippable live camera preview mirroring client's face, supporting self-reflection exercises alongside chat guidance. (Soft pulsing orb fallback when camera is disabled).
- **Mandatory Handshake Onboarding**: Automatically queries the client's current relationship with the community, dynamically routing context to Voice 1 (Fresh Lead), Voice 2 (Silver/Gold), or Voice 3 (Diamond/Platinum) of Honey's persona guidelines.
- **Methodology & Vocabulary Sidebar**: Interactive details accordions covering Honey's Three Pillars, Three Secrets, and Proprietary Vocabulary (Expanded/Contracted states, 5 Wealth Roots, etc.) for quick user reference.
- **Direct Gemini Integration**: Secure client-side requests using standard Gemini JSON API v1beta utilizing the provided API Key.
- **Rich Aesthetics**: Premium spiritual color scheme with glassmorphism panels, glowing indicator states, custom typography, and responsive grid layouts.

## Launch Instructions

To launch the project locally using Python's built-in server:

1. Open your terminal.
2. Navigate to the project directory:
   ```bash
   cd "/Users/honeyvachhani/.gemini/antigravity/scratch/mirror-magic-agent"
   ```
3. Run the Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your web browser and go to:
   [http://localhost:8000](http://localhost:8000)

## Directory Structure
- `index.html` — Layout, semantic elements, sidebars, and structural views.
- `styles.css` — Custom glassmorphism, responsive styles, animations, variables.
- `app.js` — Core logic: state, camera interface, handshake onboarding, and Gemini completions.

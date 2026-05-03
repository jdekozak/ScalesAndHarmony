# Thunderbird Bass Fretboard Visualizer

An interactive, in-browser web application designed for bassists to visualize musical scales and modes specifically on a realistically calibrated Thunderbird bass fretboard.

## Features

- **Realistic Physical Alignment**: Instead of abstract CSS grids, the notes are mathematically positioned over a real, high-resolution photo of a Gibson Thunderbird Bass fretboard. The application dynamically computes distances from the nut using standard guitar fret logarithmic scale formulas ($d = L \times (1 - 2^{-n/12})$), and linearly interpolates string taper to ensure every note marker lands precisely over the physical frets and strings in the photo.
- **Dynamic Scale Generation**: Provides robust support for Major, Minor, Pentatonics, Blues, Harmonic, and Melodic Minor scales for any root note, with automatic correct enharmonic spelling based on the selected key.
- **Mode Highlighting**: Hover over the color-coded legend to instantly isolate and highlight specific modes on the neck (e.g., Dorian, Phrygian), making it easy to see modal patterns and shapes.
- **Premium Aesthetics**: Utilizes a sleek dark mode theme, subtle CSS mix-blend-modes to weave the photograph into the background without clashing, and buttery smooth micro-animations for an elevated user experience.

## Quick Start

This project is built using vanilla HTML, CSS, and JS with Vite for local development.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. To stop the development server:
   Press `Ctrl + C` in your terminal.

   *Alternatively, to kill the server from a different terminal:*
   ```bash
   # Find the PID on port 5173 (Windows)
   netstat -ano | findstr :5173
   # Kill the process (replace <PID> with the actual number)
   taskkill /PID <PID> /F
   
   # Or use a utility:
   npx kill-port 5173
   ```

4. Open `http://localhost:5173/` in your browser.

## Architecture

- `index.html`: The core semantic markup for the UI and controls.
- `style.css`: Contains CSS variables, glassmorphism UI rules, background photo calibration properties, and keyframe animations.
- `musicLogic.js`: Stores pure music theory data structures (intervals, modes, enharmonic flat detection algorithms).
- `main.js`: Handles DOM selection, event listeners, and the complex mathematical mapping between the abstract musical space and physical image coordinate space.

## Requirements
- Node.js (v18+)
- NPM or equivalent package manager

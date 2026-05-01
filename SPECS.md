# Thunderbird Bass Fretboard App Specification

This document outlines the specifications and implementation plan for the in-browser Thunderbird Bass Fretboard application.

## App Overview
The application is an interactive web-based tool designed for bassists to visualize musical scales and modes on a realistic Thunderbird bass fretboard. The app will allow users to select a root note and a scale, instantly updating the fretboard to display the correct finger placements and note names.

## Features & Requirements

### 1. Fretboard Visualization
- **Tuning**: Standard 4-string bass tuning (E-A-D-G).
- **Aesthetics**: A realistic representation of a Thunderbird bass fretboard, utilizing a free image downloaded from the internet.
- **Frets**: Display strings across standard Thunderbird fret counts (typically 20 frets).
- **Markers**: The fretboard will display the specific note names directly on the strings (e.g., "C", "Bb") instead of generic finger placements.

### 2. Scale Selection & Logic
- **Root Note Selector**: A dropdown or clickable grid to select all 12 musical notes (C, C#, D, D#, E, F, F#, G, G#, A, A#, B).
- **Scale Type Selector**: Options for various scales (e.g., Major, Minor, Pentatonic Major/Minor, Blues, Harmonic Minor, Melodic Minor).
- **Dynamic Updates**: Changing the root note or scale will immediately update the fretboard markers.

### 3. Mode Highlighting & Legend
- **Mode Selector**: A dedicated "Mode" selector will be available. Selecting a specific mode (e.g., Dorian, Phrygian) will highlight the notes of that mode in specific colors.
- **Legend**: A clear, beautifully designed legend will map the mode names to their respective colors, helping the user visualize the mode's structure across the fretboard.

### 4. Technical Stack
- **Framework**: Vite with Vanilla JavaScript/TypeScript and HTML, ensuring lightweight and fast performance. (If you prefer a specific framework like React or Vue, please let me know).
- **Styling**: Vanilla CSS utilizing modern design principles (CSS Variables, Flexbox/Grid, Glassmorphism).
- **Graphics**: A free Thunderbird bass fretboard background image sourced from the internet, combined with premium UI elements for the application interface.

## UI/UX Design Approach
- **Premium Aesthetics**: We will use a dynamic, rich aesthetic with a dark mode or sleek studio-themed background.
- **Micro-animations**: Smooth transitions when changing scales, hovering over notes, and selecting options to make the app feel alive and responsive.
- **Responsive Design**: Ensuring the fretboard is viewable and interactive across different screen sizes.

---

## Enharmonic Spelling
Enharmonic spelling (sharps vs. flats) will automatically be decided based on the selected scale (e.g., selecting F Major will display "Bb" instead of "A#").

## Proposed Architecture

### Core Components

#### `index.html`
The main structure containing:
- Header (App Title & Controls)
- Controls Section (Root Note & Scale Dropdowns/Buttons)
- Fretboard Container (The Thunderbird bass image + SVG/HTML overlays for strings and notes)
- Legend Section (Mode/Color mappings)

#### `style.css`
- Modern design tokens (colors, typography).
- Fretboard layout (positioning frets and strings accurately over the background image).
- Marker styles, hover states, and animations.

#### `musicLogic.js`
- Definitions for the chromatic scale.
- Definitions for scale intervals (Major: 0, 2, 4, 5, 7, 9, 11).
- Logic to generate the notes of any given scale and root.
- Logic to map notes to their string/fret coordinates (EADG tuning).

#### `app.js`
- DOM manipulation and event listeners.
- Rendering the fretboard markers based on `musicLogic.js` output.
- Updating the Legend based on the selected scale.

## Verification Plan

### Automated/Local Testing
- Verify Vite development server runs successfully.
- Ensure all 12 root notes and at least 5 primary scales render the correct markers on the correct strings/frets.
- Verify the legend accurately reflects the active colors on the fretboard.

### Visual Verification
- Ensure the background image accurately represents a Thunderbird bass.
- Test responsiveness and visual appeal of the UI (glassmorphism, animations).

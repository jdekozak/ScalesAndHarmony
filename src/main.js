import './style.css';
import { getScaleNotes, TUNING, SCALES, shouldUseFlats, NOTES_FLAT, NOTES_SHARP } from './musicLogic.js';

const NUM_FRETS = 20;

const rootSelect = document.getElementById('root-select');
const scaleSelect = document.getElementById('scale-select');
const fretboardContainer = document.getElementById('fretboard');
const legendContainer = document.getElementById('legend');

let currentHighlightMode = "All";

/**
 * MANUAL SETTINGS - Adjust these to fine-tune the display
 */
const SETTINGS = {
    // Global offsets (%) - Use these to nudge all notes at once
    offsetX: 0.0,
    offsetY: 5.0,

    // Scale ratios (1.0 = default) - Use these to stretch/contract the display
    scaleX: 1.27,
    scaleY: 0.9,

    // Fretboard Geometry (%)
    nutX: 25.8,              // Horizontal start (Nut)
    fret12X: 63.4,           // Horizontal reference (12th Fret)

    // String Geometry (%)
    centerLineY: 50.2,       // Vertical center of the string set
    spacingNutY: 3.00,       // Gap between strings at the Nut
    spacingFret12Y: 5.6,     // Gap between strings at the 12th Fret (controls fanning)

    // Display
    markerSize: 8           // Note marker diameter in pixels
};

/**
 * Calculates the X position of a fret using the standard logarithmic formula.
 * d = L * (1 - (1/2)^(n/12))
 * All positions are relative to the Nut and 12th Fret settings.
 */
function getFretX(fret) {
    const scaleLength = 2 * (SETTINGS.fret12X - SETTINGS.nutX);
    const rawX = SETTINGS.nutX + scaleLength * (1 - Math.pow(0.5, fret / 12));

    // Apply global X scaling (relative to nut) and offset
    return SETTINGS.nutX + (rawX - SETTINGS.nutX) * SETTINGS.scaleX + SETTINGS.offsetX;
}

/**
 * Calculates the Y position for a specific string at a given X ratio.
 * stringIndex 0 = Top string (Logic G in standard, but mapped below), 3 = Bottom.
 */
function getStringY(stringIndex, xRatio) {
    // stringIndex is 0 to 3. Offset from center is -1.5, -0.5, 0.5, 1.5
    const multiplier = stringIndex - 1.5;

    const nutY = SETTINGS.centerLineY + (multiplier * SETTINGS.spacingNutY);
    const fret12Y = SETTINGS.centerLineY + (multiplier * SETTINGS.spacingFret12Y);

    const rawY = nutY + (fret12Y - nutY) * xRatio;

    // Apply global Y scaling (relative to center) and offset
    return SETTINGS.centerLineY + (rawY - SETTINGS.centerLineY) * SETTINGS.scaleY + SETTINGS.offsetY;
}

function init() {
    setupFretboard();
    attachListeners();
    updateApp();
}

function setupFretboard() {
    fretboardContainer.innerHTML = '';
}

function attachListeners() {
    rootSelect.addEventListener('change', () => {
        updateApp();
    });
    scaleSelect.addEventListener('change', () => {
        updateApp();
    });
}

function updateApp() {
    const root = rootSelect.value;
    const scaleName = scaleSelect.value;
    const highlightMode = currentHighlightMode;

    const scaleNotes = getScaleNotes(root, scaleName);

    drawMarkers(scaleNotes, highlightMode);
    drawLegend(scaleNotes, highlightMode);
}

function getNoteName(index, useFlats) {
    return useFlats ? NOTES_FLAT[index] : NOTES_SHARP[index];
}

function drawMarkers(scaleNotes, highlightMode) {
    document.querySelectorAll('.note-marker').forEach(el => el.remove());

    const useFlats = shouldUseFlats(rootSelect.value, scaleSelect.value);
    const scaleIndices = scaleNotes.map(n => n.index);

    // Mapping: TUNING is [G, D, A, E]. 
    // Image has E at TOP (CALIBRATION.strings[0]) and G at BOTTOM (CALIBRATION.strings[3]).
    // So:
    // G (stringIndex 0) -> Bottom (calibIndex 3)
    // E (stringIndex 3) -> Top (calibIndex 0)

    TUNING.forEach((stringInfo, stringIndex) => {
        // Mapping: TUNING is [G, D, A, E]. 
        // Image has G at TOP (stringIndex 0 -> calibIndex 0) and E at BOTTOM (stringIndex 3 -> calibIndex 3).
        const calibIndex = stringIndex;

        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const noteIndex = (stringInfo.startIndex + fret) % 12;
            const scaleScaleNoteIndex = scaleIndices.indexOf(noteIndex);

            if (scaleScaleNoteIndex !== -1) {
                const noteInfo = scaleNotes[scaleScaleNoteIndex];

                let opacity = 1;
                let transform = 'scale(1)';
                let zIndex = 10;

                if (highlightMode !== "All" && noteInfo.modeName !== highlightMode) {
                    opacity = 0.25;
                    transform = 'scale(0.8)';
                    zIndex = 5;
                }

                const marker = document.createElement('div');
                marker.className = 'note-marker';
                marker.textContent = getNoteName(noteIndex, useFlats);
                marker.style.backgroundColor = noteInfo.color;
                marker.style.opacity = opacity;
                marker.style.transform = transform;
                marker.style.zIndex = zIndex;

                // Calculate X (centered between frets)
                let leftPercent;
                if (fret === 0) {
                    leftPercent = getFretX(0) - 1.8; // Open string position
                } else {
                    const x1 = getFretX(fret - 1);
                    const x2 = getFretX(fret);
                    leftPercent = (x1 + x2) / 2;
                }

                // Calculate Y at this X (linear interpolation for fanning strings)
                const xRatio = (leftPercent - SETTINGS.nutX) / (SETTINGS.fret12X - SETTINGS.nutX);
                const topPercent = getStringY(calibIndex, xRatio);

                const halfSize = SETTINGS.markerSize / 2;
                marker.style.top = `calc(${topPercent}% - ${halfSize}px)`;
                marker.style.left = `calc(${leftPercent}% - ${halfSize}px)`;

                fretboardContainer.appendChild(marker);
            }
        }
    });
}

function drawLegend(scaleNotes, highlightMode) {
    legendContainer.innerHTML = '';

    scaleNotes.forEach(noteInfo => {
        const item = document.createElement('div');
        item.className = 'legend-item';

        const isHighlighted = highlightMode === "All" || highlightMode === noteInfo.modeName;
        item.style.opacity = isHighlighted ? '1' : '0.4';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = noteInfo.color;

        const text = document.createElement('span');
        text.className = 'legend-text';
        text.textContent = `${noteInfo.modeName} (${noteInfo.name})`;

        item.appendChild(colorBox);
        item.appendChild(text);

        item.addEventListener('mouseenter', () => {
            currentHighlightMode = noteInfo.modeName;
            updateApp();
        });

        item.addEventListener('mouseleave', () => {
            currentHighlightMode = "All";
            updateApp();
        });

        legendContainer.appendChild(item);
    });
}

init();

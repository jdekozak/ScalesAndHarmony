import './style.css';
import { getScaleNotes, TUNING, SCALES, shouldUseFlats, NOTES_FLAT, NOTES_SHARP } from './musicLogic.js';

const NUM_FRETS = 20;

const rootSelect = document.getElementById('root-select');
const scaleSelect = document.getElementById('scale-select');
const fretboardContainer = document.getElementById('fretboard');
const legendContainer = document.getElementById('legend');

let currentHighlightMode = "All";

function init() {
    setupFretboard();
    attachListeners();
    updateApp();
}

function setupFretboard() {
    fretboardContainer.innerHTML = '';
    
    // Draw Frets
    for (let f = 0; f <= NUM_FRETS; f++) {
        const fret = document.createElement('div');
        fret.className = f === 0 ? 'fret nut' : 'fret';
        fretboardContainer.appendChild(fret);
    }
    
    // Draw fret markers (dots) for standard bass (frets 3, 5, 7, 9, 12, 15, 17, 19)
    const dotFrets = [3, 5, 7, 9, 15, 17, 19];
    const doubleDotFrets = [12];
    
    const frets = document.querySelectorAll('.fret');
    
    dotFrets.forEach(f => {
        if(frets[f]) {
            const dot = document.createElement('div');
            dot.className = 'fret-dot single-dot';
            frets[f].appendChild(dot);
        }
    });
    
    doubleDotFrets.forEach(f => {
        if(frets[f]) {
            const dotContainer = document.createElement('div');
            dotContainer.className = 'double-dot-container';
            dotContainer.innerHTML = '<div class="fret-dot"></div><div class="fret-dot"></div>';
            frets[f].appendChild(dotContainer);
        }
    });

    const stringsContainer = document.createElement('div');
    stringsContainer.className = 'strings-container';
    
    TUNING.forEach((stringInfo, i) => {
        const stringEl = document.createElement('div');
        stringEl.className = `string string-${i}`;
        const thickness = (i + 1) * 1.5 + 1; 
        stringEl.style.height = `${thickness}px`;
        
        // Position string vertically
        const topPercent = (i / (TUNING.length - 1)) * 100;
        const actualTop = 15 + (topPercent * 0.7); 
        stringEl.style.top = `calc(${actualTop}% - ${thickness/2}px)`;
        
        stringsContainer.appendChild(stringEl);
    });
    
    fretboardContainer.appendChild(stringsContainer);
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
    
    TUNING.forEach((stringInfo, stringIndex) => {
        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const noteIndex = (stringInfo.startIndex + fret) % 12;
            const scaleNoteIndex = scaleIndices.indexOf(noteIndex);
            
            if (scaleNoteIndex !== -1) {
                const noteInfo = scaleNotes[scaleNoteIndex];
                
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
                
                const topPercent = (stringIndex / (TUNING.length - 1)) * 100;
                const actualTop = 15 + (topPercent * 0.7); 
                marker.style.top = `calc(${actualTop}% - 14px)`; 
                
                let leftPercent;
                if (fret === 0) {
                    leftPercent = 1; 
                } else {
                    leftPercent = 2 + ((fret - 0.5) * (98 / NUM_FRETS));
                }
                
                marker.style.left = `calc(${leftPercent}% - 14px)`;
                
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
